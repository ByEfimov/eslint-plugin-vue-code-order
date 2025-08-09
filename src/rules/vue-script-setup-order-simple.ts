import { Rule } from "eslint";
import {
  VariableDeclarator,
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
    ],
    description: "Framework initialization functions",
  },
  stores: {
    patterns: [".*Store", "usePinia", "useStore"],
    description: "Store initialization",
  },
  libraries: {
    patterns: ["useModal", "ref", "reactive", "nextTick"],
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
    patterns: ["useAsyncData", "useLazyAsyncData", "useFetch", "useLazyFetch"],
    description: "Server requests and data fetching",
  },
  "app-functions": {
    patterns: ["^(handle[A-Z].*|update[A-Z].*)$"],
    description: "Application functions",
  },
  modals: {
    patterns: ["^(open[A-Z].*Modal.*|close[A-Z].*Modal.*)$"],
    description: "Modal windows and functions",
  },
  "watchers-listeners": {
    patterns: ["watch", "watchEffect"],
    description: "Watchers and event listeners",
  },
  "app-lifecycle": {
    patterns: [
      "definePageMeta",
      "onMounted",
      "onUnmounted",
      "onActivated",
      "onDeactivated",
    ],
    description: "App lifecycle and SEO functions",
  },
};

function getCallExpressionName(declaration: VariableDeclarator): string {
  if (!declaration || !declaration.init) return "";

  if (declaration.init.type === "CallExpression") {
    if (declaration.init.callee.type === "Identifier") {
      return declaration.init.callee.name;
    }
  } else if (
    declaration.init.type === "AwaitExpression" &&
    declaration.init.argument.type === "CallExpression" &&
    declaration.init.argument.callee.type === "Identifier"
  ) {
    return declaration.init.argument.callee.name;
  }

  return "";
}

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

      // Сначала проверяем по вызываемой функции
      if (callName) {
        for (const [groupName, group] of Object.entries(groups)) {
          for (const pattern of group.patterns) {
            const regex = new RegExp(pattern);
            if (regex.test(callName)) {
              return groupName;
            }
          }
        }
      }

      // Затем по имени переменной (только для Identifier)
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
      "Program > ImportDeclaration, Program > VariableDeclaration, Program > ExpressionStatement, Program > FunctionDeclaration"(
        node: Statement | ModuleDeclaration | Directive
      ) {
        // Проверяем только если это Vue файл
        const filename = context.getFilename();
        if (!filename.endsWith(".vue")) {
          return;
        }

        const sourceCode = context.getSourceCode();
        const allNodes = sourceCode.ast.body;

        // Находим индекс текущей ноды
        const currentIndex = allNodes.indexOf(node);
        if (currentIndex === -1) return;

        // Анализируем порядок
        const currentGroup = getNodeGroup(node, groups);
        const currentGroupIndex = getGroupIndex(currentGroup, order);

        // Проверяем все предыдущие ноды
        for (let i = currentIndex - 1; i >= 0; i--) {
          const prevNode = allNodes[i];
          const prevGroup = getNodeGroup(prevNode, groups);
          const prevGroupIndex = getGroupIndex(prevGroup, order);

          if (prevGroupIndex > currentGroupIndex) {
            context.report({
              node,
              messageId: "incorrectOrder",
              data: {
                expectedGroup: prevGroup
                  ? groups[prevGroup]?.description || prevGroup
                  : "unknown",
                actualGroup: currentGroup
                  ? groups[currentGroup]?.description || currentGroup
                  : "unknown",
              },
            });
            break;
          }
        }
      },
    };
  },
};

export default rule;
