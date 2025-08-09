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
  "types",
  "framework-init",
  "stores",
  "ui-libraries",
  "libraries",
  "utils",
  "validation",
  "variables",
  "server-requests",
  "computed-hooks",
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
  types: {
    patterns: [
      "^(interface|type|enum)",
      "defineProps",
      "defineEmits",
      "defineExpose",
      "defineSlots",
      "withDefaults",
    ],
    description: "TypeScript types and Vue macros",
  },
  "framework-init": {
    patterns: [
      // Vue 3 / Nuxt 3 Core
      "useRoute",
      "useRouter",
      "useNuxtApp",
      "useCookie",
      "useRuntimeConfig",
      "useAppConfig",
      "useRequestHeaders",
      "useRequestEvent",
      "useRequestURL",
      "useRequestFetch",

      // SEO & Meta
      "useHead",
      "useSeoMeta",
      "useServerSeoMeta",
      "useHeadSafe",

      // Internationalization
      "useLocalePath",
      "useI18n",
      "useSwitchLocalePath",
      "useLocaleRoute",
      "useNuxtI18n",

      // Auth & Session
      "useSupabaseAuth",
      "useSupabaseAuthClient",
      "useSupabaseUser",
      "useAuth",
      "useAuthState",
      "useAuthUser",
      "useSession",
      "useSessionState",

      // Device & Platform
      "useDevice",
      "useUserAgent",
      "useColorMode",
      "usePreferredDark",
      "useMediaQuery",

      // Hydration
      "useHydration",
      "useSSRContext",
    ],
    description: "Framework initialization functions",
  },
  stores: {
    patterns: [
      // Pinia & Stores
      ".*Store",
      "usePinia",
      "useStore",
      "defineStore",
      "createPinia",
      "setActivePinia",
      "mapStores",
      "mapState",
      "mapGetters",
      "mapActions",
      "mapWritableState",

      // Other state management
      "useGlobalState",
      "useState",
      "useSharedState",
      "createGlobalState",
    ],
    description: "Store initialization",
  },
  "ui-libraries": {
    patterns: [
      // Popular UI Libraries
      "useModal",
      "useVuelidate",
      "useForm",
      "useField",
      "useFormContext",
      "useToast",
      "useNotification",
      "useDialog",
      "useConfirm",
      "useDrawer",
      "useSidebar",
      "useDropdown",
      "usePopover",
      "useTooltip",
      "useAccordion",
      "useTabs",
      "useCarousel",
      "useSlider",
      "useDatePicker",
      "useTimePicker",
      "useColorPicker",
      "useFileUpload",
      "useDragAndDrop",
      "useResizable",
      "useSortable",
      "useVirtualList",
      "useInfiniteScroll",
      "usePagination",
      "useTable",
      "useDataTable",
      "useTree",
      "useContextMenu",

      // Chart Libraries
      "useChart",
      "useECharts",
      "useChartJS",
      "useApexCharts",

      // Map Libraries
      "useMap",
      "useLeaflet",
      "useGoogleMaps",

      // Calendar Libraries
      "useCalendar",
      "useFullCalendar",

      // Rich Text Editors
      "useEditor",
      "useTipTap",
      "useQuill",
      "useMonaco",
    ],
    description: "UI libraries and components",
  },
  libraries: {
    patterns: [
      // Vue 3 Composition API
      "reactive",
      "ref",
      "readonly",
      "shallowRef",
      "shallowReactive",
      "toRef",
      "toRefs",
      "toRaw",
      "markRaw",
      "unref",
      "isRef",
      "isReactive",
      "isReadonly",
      "isProxy",
      "nextTick",
      "watchEffect",
      "watchPostEffect",
      "watchSyncEffect",
      "effectScope",
      "getCurrentScope",
      "onScopeDispose",
      "inject",
      "provide",
      "hasInjectionContext",
      "customRef",
      "triggerRef",
      "shallowReadonly",

      // VueUse Core (базовые)
      "useCounter",
      "useToggle",
      "useBoolean",
      "useClipboard",
      "useTitle",
      "useFavicon",
      "useFullscreen",
      "usePermission",
      "useShare",
      "useNetwork",
      "useOnline",
      "useBattery",
      "useGeolocation",
      "useStorage",
      "useLocalStorage",
      "useSessionStorage",
      "useCookies",
      "useVModel",
      "useVModels",
    ],
    description: "Library and Vue composition API",
  },
  utils: {
    patterns: [
      // Utility functions and helpers
      "use[A-Z][a-zA-Z]*Utils?",
      "use[A-Z][a-zA-Z]*Helper",
      "use[A-Z][a-zA-Z]*Service",
      "use[A-Z][a-zA-Z]*Formatter",
      "use[A-Z][a-zA-Z]*Parser",
      "use[A-Z][a-zA-Z]*Converter",
      "useDebounce",
      "useThrottle",
      "useMemoize",
      "useClamp",
      "useRandom",
      "useUuid",
      "createUtils?",
      "createHelper",
      "createService",
      "formatDate",
      "formatCurrency",
      "formatNumber",
      "debounce",
      "throttle",
      "clamp",
      "random",
      "uuid",
      "generateId",
      "slugify",
      "capitalize",
      "truncate",
      "sanitize",
    ],
    description: "Utility functions and helpers",
  },
  validation: {
    patterns: [
      // Validation libraries
      "useVuelidate",
      "useSchema",
      "useValidation",
      "useValidator",
      "useValidationSchema",
      "useValidationRules",
      "useYup",
      "useZod",
      "useJoi",
      "validate",
      "validateForm",
      "validateField",
      "validateEmail",
      "validatePassword",
      "validatePhone",
      "validateURL",
      "validateRequired",
      "createValidator",
    ],
    description: "Validation libraries and schemas",
  },
  variables: {
    patterns: [
      // Common variable patterns
      "^(message|loading|data|config|options|dateRange|buttonOptions|isLoading|isError|error|result|response|payload|params|query|body|headers|status|state|form|formData|formState)$",
      "^(show|hide|open|close|active|inactive|visible|hidden|enabled|disabled|selected|checked|expanded|collapsed)$",
      "^(current|selected|active|focused|hovered|pressed|loading|pending|success|error|warning|info)$",
      "^(items|list|data|collection|records|entries|results|values|keys|options|choices|selections)$",
      "^(text|content|value|name|title|label|description|message|note|comment)$",
    ],
    description: "Variables and reactive data",
  },
  "server-requests": {
    patterns: [
      // Nuxt 3 Data Fetching
      "useAsyncData",
      "useLazyAsyncData",
      "useFetch",
      "useLazyFetch",
      "\\$fetch",
      "refresh",
      "refreshCookie",
      "clearNuxtData",
      "clearNuxtState",

      // Custom fetch composables
      "useFetchData",
      "useApiCall",
      "useHttpClient",
      "useRestApi",
      "useGraphQLQuery",
      "useSubscription",
      "useMutation",
      "useQuery",
      "useInfiniteQuery",
      "usePrefetch",
      "usePreload",

      // Cache & State management for requests
      "useSWR",
      "useStaleWhileRevalidate",
      "useCache",
      "useCachedAsyncData",
      "useCachedFetch",
    ],
    description: "Server requests and data fetching",
  },
  "computed-hooks": {
    patterns: [
      // Vue computed
      "computed",
      "computedAsync",
      "computedEager",
      "computedWithControl",

      // Custom hooks and composables
      "useFilter",
      "useSort",
      "useSearch",
      "usePaginate",
      "useGroupBy",
      "useMap",
      "useReduce",
      "useFind",

      // Derived state
      "useDerivedState",
      "useComputedState",
      "useCalculatedValue",
      "useTransformedData",
      "useMappedData",
      "useFilteredData",
      "useSortedData",
      "useGroupedData",
      "usePaginatedData",
    ],
    description: "Computed properties and custom hooks",
  },
  "app-functions": {
    patterns: [
      // Event handlers
      "^handle[A-Z].*",
      "^on(Click|Submit|Change|Input|Focus|Blur|Key|Mouse|Touch|Drag|Drop|Scroll|Resize|Load|Error)[A-Z].*",
      "^(click|submit|change|input|focus|blur|keydown|keyup|keypress|mousedown|mouseup|scroll|resize)[A-Z].*",

      // CRUD operations
      "^(create|add|insert)[A-Z].*",
      "^(read|get|fetch|load|retrieve)[A-Z].*",
      "^(update|edit|modify|change|set)[A-Z].*",
      "^(delete|remove|destroy|clear)[A-Z].*",

      // Navigation & routing
      "^(navigate|goto|redirect|push|replace|back|forward)[A-Z].*",

      // Form operations
      "^(validate|submit|reset|clear|populate)[A-Z].*",
      "^(save|cancel|edit|preview)[A-Z].*",

      // Modal & dialog operations
      "^(open|close|show|hide|toggle)[A-Z].*",
      "^(confirm|prompt|alert)[A-Z].*",

      // Data manipulation
      "^(filter|sort|group|search|paginate)[A-Z].*",
      "^(transform|map|reduce|aggregate)[A-Z].*",

      // UI state management
      "^(toggle|switch|activate|deactivate|enable|disable)[A-Z].*",
      "^(select|deselect|check|uncheck|expand|collapse)[A-Z].*",
    ],
    description: "Application functions and event handlers",
  },
  modals: {
    patterns: [
      // Modal operations
      "^(open|close|show|hide|toggle)[A-Z].*[Mm]odal.*",
      "^(open|close|show|hide|toggle)[A-Z].*[Dd]ialog.*",
      "^(open|close|show|hide|toggle)[A-Z].*[Pp]opup.*",
      "^(open|close|show|hide|toggle)[A-Z].*[Dd]rawer.*",
      "^(open|close|show|hide|toggle)[A-Z].*[Ss]idebar.*",
      "^(open|close|show|hide|toggle)[A-Z].*[Pp]anel.*",
      "^(open|close|show|hide|toggle)[A-Z].*[Oo]verlay.*",

      // Specific modal types
      "^(open|close|show|hide)[A-Z].*[Cc]onfirm.*",
      "^(open|close|show|hide)[A-Z].*[Aa]lert.*",
      "^(open|close|show|hide)[A-Z].*[Pp]rompt.*",
      "^(open|close|show|hide)[A-Z].*[Cc]reate.*",
      "^(open|close|show|hide)[A-Z].*[Ee]dit.*",
      "^(open|close|show|hide)[A-Z].*[Dd]elete.*",
      "^(open|close|show|hide)[A-Z].*[Vv]iew.*",
      "^(open|close|show|hide)[A-Z].*[Pp]review.*",
      "^(open|close|show|hide)[A-Z].*[Ss]ettings.*",

      // Modal state management
      "^(show|hide|toggle|set)[A-Z].*[Mm]odal",
      "^modal[A-Z].*",
      "^dialog[A-Z].*",
      "^popup[A-Z].*",
      "^drawer[A-Z].*",
      "^sidebar[A-Z].*",
      "^overlay[A-Z].*",
    ],
    description: "Modal windows, dialogs, and overlay functions",
  },
  "watchers-listeners": {
    patterns: [
      // Vue watchers
      "watch",
      "watchEffect",
      "watchPostEffect",
      "watchSyncEffect",
      "watchIgnorable",
      "watchOnce",
      "watchDeep",
      "watchImmediate",
      "watchThrottled",
      "watchDebounced",

      // Event listeners
      "addEventListener",
      "removeEventListener",
      "useEventListener",
      "useDocumentListener",
      "useWindowListener",
      "useGlobalEventListener",

      // Custom event listeners
      "^(listen|unlisten|subscribe|unsubscribe)[A-Z].*",
      "^(on|off|emit|trigger)[A-Z].*",

      // DOM observers
      "useResizeObserver",
      "useMutationObserver",
      "useIntersectionObserver",

      // Device events
      "useMediaQuery",
      "useBreakpoints",
      "useDeviceOrientation",
      "useGeolocation",
      "useBattery",
      "useNetwork",
      "useOnline",
      "useFocus",
      "useActiveElement",
      "useMouse",
      "useKeyModifier",
      "useMagicKeys",
    ],
    description: "Watchers, observers, and event listeners",
  },
  "app-lifecycle": {
    patterns: [
      // Vue lifecycle hooks
      "onBeforeMount",
      "onMounted",
      "onBeforeUpdate",
      "onUpdated",
      "onBeforeUnmount",
      "onUnmounted",
      "onActivated",
      "onDeactivated",
      "onErrorCaptured",

      // Nuxt lifecycle hooks
      "onBeforeRouteLeave",
      "onBeforeRouteUpdate",
      "definePageMeta",
      "defineRouteRules",
      "defineNuxtConfig",
      "defineNuxtPlugin",
      "defineAppConfig",

      // SEO & Meta
      "useSeoMeta",
      "useServerSeoMeta",
      "useHead",
      "useHeadSafe",

      // Error handling
      "useErrorHandler",
      "useGlobalErrorHandler",
      "useAsyncErrorHandler",
      "useErrorBoundary",

      // Performance & optimization
      "usePreload",
      "usePrefetch",
      "useLazyHydration",
      "useHydration",
      "useSSR",
      "useClientOnly",
      "useAsyncComponent",
    ],
    description: "App lifecycle, SEO, and framework hooks",
  },
};

function getCallExpressionName(node: VariableDeclarator): string {
  if (!node || !node.init) return "";

  // Простой вызов функции: const data = useData()
  if (node.init.type === "CallExpression") {
    return extractCallName(node.init);
  }

  // Await выражение: const data = await useAsyncData()
  if (
    node.init.type === "AwaitExpression" &&
    node.init.argument.type === "CallExpression"
  ) {
    return extractCallName(node.init.argument);
  }

  return "";
}

function extractCallName(callExpression: unknown): string {
  if (!callExpression || (callExpression as any).type !== "CallExpression")
    return "";

  const callee = (callExpression as any).callee;

  // Простой вызов: useData()
  if (callee.type === "Identifier") {
    return callee.name;
  }

  // Цепочка вызовов: obj.useData() или obj.method().useData()
  if (callee.type === "MemberExpression") {
    return getMemberExpressionCallName(callee);
  }

  // Опциональная цепочка: obj?.useData?.()
  if (
    callee.type === "ChainExpression" &&
    callee.expression?.type === "MemberExpression"
  ) {
    return getMemberExpressionCallName(callee.expression);
  }

  return "";
}

function getMemberExpressionCallName(memberExpression: unknown): string {
  if (
    !memberExpression ||
    (memberExpression as any).type !== "MemberExpression"
  )
    return "";

  // Получаем имя последнего метода в цепочке
  if ((memberExpression as any).property?.type === "Identifier") {
    const methodName = (memberExpression as any).property.name;

    // Если это цепочка вызовов, попробуем найти наиболее релевантный
    if ((memberExpression as any).object?.type === "Identifier") {
      const objectName = (memberExpression as any).object.name;

      // Специальные случаи для популярных паттернов
      if (objectName === "$nuxt" || objectName === "nuxtApp") {
        return `use${methodName.charAt(0).toUpperCase()}${methodName.slice(1)}`;
      }

      // Возвращаем имя метода
      return methodName;
    }

    // Рекурсивно обрабатываем сложные цепочки
    if ((memberExpression as any).object?.type === "MemberExpression") {
      const nestedName = getMemberExpressionCallName(
        (memberExpression as any).object
      );
      return nestedName || methodName;
    }

    return methodName;
  }

  return "";
}

function getDestructuredNames(node: VariableDeclarator): string[] {
  if (!node.id || node.id.type !== "ObjectPattern") return [];

  const names: string[] = [];

  for (const property of node.id.properties) {
    if (property.type === "Property" && property.key?.type === "Identifier") {
      names.push(property.key.name);
    }

    if (
      property.type === "RestElement" &&
      property.argument?.type === "Identifier"
    ) {
      names.push(property.argument.name);
    }
  }

  return names;
}

function getArrayDestructuredNames(node: VariableDeclarator): string[] {
  if (!node.id || node.id.type !== "ArrayPattern") return [];

  const names: string[] = [];

  for (const element of node.id.elements) {
    if (element?.type === "Identifier") {
      names.push(element.name);
    }

    if (
      element?.type === "RestElement" &&
      element.argument?.type === "Identifier"
    ) {
      names.push(element.argument.name);
    }
  }

  return names;
}

function getNodeGroup(
  node: Statement | ModuleDeclaration | Directive,
  groups: Record<string, GroupConfig>
): string | null {
  // Для импортов
  if (node.type === "ImportDeclaration") {
    return "imports";
  }

  // Для TypeScript декларация типов
  if (
    (node as any).type === "TSInterfaceDeclaration" ||
    (node as any).type === "TSTypeAliasDeclaration" ||
    (node as any).type === "TSEnumDeclaration"
  ) {
    return "types";
  }

  // Для переменных проверяем вызываемую функцию
  if (node.type === "VariableDeclaration") {
    for (const declaration of node.declarations) {
      const callName = getCallExpressionName(declaration);

      // Сначала проверяем по вызываемой функции
      if (callName) {
        const group = findGroupByPattern(callName, groups);
        if (group) return group;
      }

      // Затем проверяем деструктурированные имена
      const destructuredNames = getDestructuredNames(declaration);
      for (const name of destructuredNames) {
        const group = findGroupByPattern(name, groups);
        if (group) return group;
      }

      // Проверяем деструктуризацию массивов
      const arrayNames = getArrayDestructuredNames(declaration);
      for (const name of arrayNames) {
        const group = findGroupByPattern(name, groups);
        if (group) return group;
      }

      // Если не нашли по вызову, проверяем имя переменной (только для Identifier)
      if (declaration.id.type === "Identifier") {
        const varName = declaration.id.name;
        const group = findGroupByPattern(varName, groups);
        if (group) return group;
      }
    }
  }

  // Для выражений
  if (
    node.type === "ExpressionStatement" &&
    node.expression.type === "CallExpression"
  ) {
    const callName = extractCallName(node.expression);
    if (callName) {
      const group = findGroupByPattern(callName, groups);
      if (group) return group;
    }
  }

  // Для функциональных деклараций
  if (node.type === "FunctionDeclaration" && node.id?.name) {
    const functionName = node.id.name;
    const group = findGroupByPattern(functionName, groups);
    if (group) return group;
  }

  return null;
}

function findGroupByPattern(
  name: string,
  groups: Record<string, GroupConfig>
): string | null {
  for (const [groupName, group] of Object.entries(groups)) {
    for (const pattern of group.patterns) {
      try {
        const regex = new RegExp(pattern);
        if (regex.test(name)) {
          return groupName;
        }
      } catch {
        // Игнорируем ошибки в регулярных выражениях
        console.warn(`Invalid regex pattern: ${pattern}`);
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
