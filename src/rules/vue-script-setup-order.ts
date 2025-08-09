import { Rule } from "eslint";
import {
  VariableDeclarator,
  Program,
  Statement,
  ModuleDeclaration,
  Directive,
} from "estree";

interface GroupConfig {
  patterns: string[];
  description: string;
}

interface OrderConfig {
  order: string[];
  groups: Record<string, GroupConfig>;
}

const defaultOrder = [
  "imports",
  "framework-init",
  "stores",
  "libraries",
  "variables",
  "computed-hooks",
  "server-requests",
  "app-functions",
  "modals",
  "watchers-listeners",
  "app-lifecycle",
];

const defaultGroups: Record<string, GroupConfig> = {
  imports: {
    patterns: [], // Импорты обрабатываются специально
    description: "Import statements",
  },
  "framework-init": {
    patterns: [
      "useRoute",
      "useRouter",
      "useNuxtApp",
      "useCookie",
      "useRuntimeConfig",
      "useHead",
      "useSeoMeta",
      "useLocalePath",
      "useI18n",
    ],
    description: "Framework initialization functions",
  },
  stores: {
    patterns: [".*Store", "usePinia", "useStore"],
    description: "Store initialization",
  },
  libraries: {
    patterns: ["useModal", "reactive", "ref", "nextTick"],
    description: "Library and Vue composition API",
  },
  variables: {
    patterns: [
      "^(message|loading|data|config|options|dateRange|buttonOptions)$",
    ],
    description: "Variables and reactive data",
  },
  "computed-hooks": {
    patterns: ["computed", "useFilter"],
    description: "Computed properties and custom hooks",
  },
  "server-requests": {
    patterns: [
      "useAsyncData",
      "useLazyAsyncData",
      "useFetch",
      "useLazyFetch",
      "\\$fetch",
      "refresh",
    ],
    description: "Server requests and data fetching",
  },
  "app-functions": {
    patterns: ["^(handleClick|updatePeriod)$"],
    description: "Application functions",
  },
  modals: {
    patterns: ["^(openModal|openCreateEventModal|openCreatePlanModal)$"],
    description: "Modal windows and functions",
  },
  "watchers-listeners": {
    patterns: ["watch"],
    description: "Watchers and event listeners",
  },
  "app-lifecycle": {
    patterns: [
      "definePageMeta",
      "onMounted",
      "onUnmounted",
      "onBeforeMount",
      "onBeforeUnmount",
      "onActivated",
      "onDeactivated",
      "onUpdated",
      "onBeforeUpdate",
    ],
    description: "App lifecycle and SEO functions",
  },
};

function getNodeGroup(
  node: Statement | ModuleDeclaration | Directive,
  groups: Record<string, GroupConfig>
): string | null {
  // Для импортов
  if (node.type === "ImportDeclaration") {
    return "imports";
  }

  // Для переменных проверяем вызываемую функцию
  if (node.type === "VariableDeclaration") {
    for (const declaration of node.declarations) {
      const callName = getCallExpressionName(declaration);
      if (callName) {
        // Проверяем паттерны по имени вызываемой функции
        for (const [groupName, group] of Object.entries(groups)) {
          for (const pattern of group.patterns) {
            const regex = new RegExp(pattern);
            if (regex.test(callName)) {
              return groupName;
            }
          }
        }
      }

      // Если не нашли по вызову, проверяем имя переменной (только для Identifier)
      if (declaration.id.type === "Identifier") {
        const varName = declaration.id.name;
        for (const [groupName, group] of Object.entries(groups)) {
          for (const pattern of group.patterns) {
            const regex = new RegExp(pattern);
            if (regex.test(varName)) {
              return groupName;
            }
          }
        }
      }
    }
  }

  // Для выражений
  if (
    node.type === "ExpressionStatement" &&
    node.expression.type === "CallExpression"
  ) {
    if (node.expression.callee.type === "Identifier") {
      const callName = node.expression.callee.name;
      for (const [groupName, group] of Object.entries(groups)) {
        for (const pattern of group.patterns) {
          const regex = new RegExp(pattern);
          if (regex.test(callName)) {
            return groupName;
          }
        }
      }
    }
  }

  return null;
}

function getCallExpressionName(node: VariableDeclarator): string {
  if (!node || !node.init) return "";

  if (node.init.type === "CallExpression") {
    if (node.init.callee.type === "Identifier") {
      return node.init.callee.name;
    }
  } else if (
    node.init.type === "AwaitExpression" &&
    node.init.argument.type === "CallExpression" &&
    node.init.argument.callee.type === "Identifier"
  ) {
    return node.init.argument.callee.name;
  }

  return "";
}

function getGroupIndex(group: string | null, order: string[]): number {
  if (!group) return order.length;
  const index = order.indexOf(group);
  return index === -1 ? order.length : index;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "layout",
    docs: {
      description: "Enforce correct order of code in Vue script setup",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          order: {
            type: "array",
            items: { type: "string" },
          },
          groups: {
            type: "object",
            additionalProperties: {
              type: "object",
              properties: {
                patterns: {
                  type: "array",
                  items: { type: "string" },
                },
                description: { type: "string" },
              },
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      incorrectOrder:
        'Code should be ordered correctly. "{{actualGroup}}" should come before "{{expectedGroup}}"',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const options = (context.options[0] as OrderConfig) || {};
    const order = options.order || defaultOrder;
    const groups = { ...defaultGroups, ...options.groups };

    return {
      Program(node: Program) {
        // Проверяем только если это Vue файл со script setup
        const filename = context.getFilename();
        if (!filename.endsWith(".vue")) {
          return;
        }

        // Ищем script setup блок
        const sourceCode = context.getSourceCode();
        const text = sourceCode.getText();

        if (!text.includes("<script setup")) {
          return;
        }

        const statements = node.body;
        let lastGroupIndex = -1;

        for (let i = 0; i < statements.length; i++) {
          const statement = statements[i];
          const group = getNodeGroup(statement, groups);
          const currentGroupIndex = getGroupIndex(group, order);

          if (currentGroupIndex < lastGroupIndex) {
            const lastGroup = order[lastGroupIndex] || "unknown";
            const currentGroup = group || "unknown";

            context.report({
              node: statement,
              messageId: "incorrectOrder",
              data: {
                expectedGroup: groups[lastGroup]?.description || lastGroup,
                actualGroup: groups[currentGroup]?.description || currentGroup,
              },
              fix() {
                // Базовая реализация автофикса - можно расширить
                return null;
              },
            });
          } else {
            lastGroupIndex = Math.max(lastGroupIndex, currentGroupIndex);
          }
        }
      },
    };
  },
};

export default rule;
