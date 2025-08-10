interface GroupConfig {
  patterns: string[];
  description: string;
}

interface CategoryResult {
  name: string;
  description: string;
  order?: number;
}

// Импортируем конфигурацию групп из вашего ESLint плагина
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
    patterns: [],
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
      "useHead",
      "useSeoMeta",
      "useServerSeoMeta",
      "useHeadSafe",
      "useLocalePath",
      "useI18n",
      "useSwitchLocalePath",
      "useLocaleRoute",
      "useNuxtI18n",
      "useSupabaseAuth",
      "useSupabaseAuthClient",
      "useSupabaseUser",
      "useAuth",
      "useAuthState",
      "useAuthUser",
      "useSession",
      "useSessionState",
      "useDevice",
      "useUserAgent",
      "useColorMode",
      "usePreferredDark",
      "useMediaQuery",
    ],
    description:
      "🔧 Framework initialization - Vue, Nuxt, and core composables",
  },
  stores: {
    patterns: [
      ".*[Ss]tore$",
      ".*[Ss]tore\\(",
      "usePinia",
      "useStore",
      "defineStore",
      "storeToRefs",
      "mapStores",
      "mapState",
      "mapGetters",
      "mapActions",
    ],
    description: "🏪 Stores - Pinia and Vuex store initialization",
  },
  "ui-libraries": {
    patterns: [
      "useQuasar",
      "useToast",
      "useNotification",
      "useDialog",
      "useLoading",
      "useModal",
      "useVuelidate",
      "useValidation",
      "useForm",
      "useField",
      "useElementPlus",
      "useAntd",
      "useVuetify",
      "usePrimeVue",
      "useBootstrap",
      "useTailwind",
      "useUnoCSS",
      "useWindiCSS",
      "ChartJS",
      "Chart",
      "register",
    ],
    description: "🎨 UI Libraries - Component frameworks and design systems",
  },
  libraries: {
    patterns: [
      "useClipboard",
      "useLocalStorage",
      "useSessionStorage",
      "useDateFns",
      "useMoment",
      "useDayjs",
      "useLodash",
      "useRamda",
      "useAxios",
      "useFetch",
      "useHttp",
      "useApi",
      "useSocket",
      "useWebSocket",
      "useGraphQL",
      "useApollo",
      "useI18n",
      "useTranslation",
      "useLocale",
      "useCharts",
      "useEcharts",
      "useChartjs",
      "useD3",
    ],
    description: "📚 Libraries - External libraries and utilities",
  },
  utils: {
    patterns: [
      "use.*[Uu]til.*",
      "use.*[Hh]elper.*",
      "use.*[Ff]ormat.*",
      "use.*[Pp]arse.*",
      "use.*[Tt]ransform.*",
      "use.*[Cc]onvert.*",
      "formatDate",
      "parseData",
      "transformData",
      "convertValue",
      "generateId",
      "createSlug",
      "sanitizeInput",
      "validateEmail",
      "normalizeData",
    ],
    description: "🛠️ Utils - Utility functions and helpers",
  },
  validation: {
    patterns: [
      "useVuelidate",
      "useValidation",
      "useValidator",
      "useSchema",
      "useYup",
      "useZod",
      "useJoi",
      "useAjv",
      "validate.*",
      "check.*",
      "verify.*",
      "rules",
      "schema",
    ],
    description: "✅ Validation - Form validation and schema validation",
  },
  variables: {
    patterns: [
      "ref",
      "reactive",
      "readonly",
      "shallowRef",
      "shallowReactive",
      "toRef",
      "toRefs",
      "unref",
      "isRef",
      "isReactive",
      "isReadonly",
      "isProxy",
      "markRaw",
      "triggerRef",
      "customRef",
      "shallowReadonly",
      "toValue",
      "toRaw",
    ],
    description: "📊 Variables - Reactive state and references",
  },
  "server-requests": {
    patterns: [
      "useAsyncData",
      "useLazyAsyncData",
      "useFetch",
      "useLazyFetch",
      "useNuxtData",
      "usePendingData",
      "useRequestHeaders",
      "useRequestURL",
      "useRequestEvent",
      "useServerData",
      "useQuery",
      "useMutation",
      "useSubscription",
      "useInfiniteQuery",
      "useSuspenseQuery",
      "useQueries",
      "useIsFetching",
      "useIsMutating",
      "useQueryClient",
    ],
    description: "🌐 Server Requests - API calls and data fetching",
  },
  "computed-hooks": {
    patterns: [
      "computed",
      "watchEffect",
      "watchSyncEffect",
      "watchPostEffect",
      "use.*[Cc]omputed.*",
      "use.*[Hh]ook.*",
      "use.*[Cc]ustom.*",
      "use.*[Ff]ilter.*",
      "use.*[Ss]earch.*",
      "use.*[Ss]ort.*",
      "use.*[Pp]agination.*",
    ],
    description:
      "🔄 Computed & Custom Hooks - Computed properties and custom composables",
  },
  "app-functions": {
    patterns: [
      "^(handle|on)[A-Z].*",
      "^(submit|save|delete|update|create|edit)[A-Z].*",
      "^(validate|submit|reset|clear|populate)[A-Z].*",
      "^(save|cancel|edit|preview)[A-Z].*",
      "^(filter|sort|group|search|paginate)[A-Z].*",
      "^(transform|map|reduce|aggregate)[A-Z].*",
      "^(toggle|switch|activate|deactivate|enable|disable)[A-Z].*",
      "^(select|deselect|check|uncheck|expand|collapse)[A-Z].*",
    ],
    description: "⚡ App Functions - Application logic and event handlers",
  },
  modals: {
    patterns: [
      "^(open|close|show|hide|toggle)[A-Z].*[Mm]odal.*",
      "^(open|close|show|hide|toggle)[A-Z].*[Dd]ialog.*",
      "^(open|close|show|hide|toggle)[A-Z].*[Pp]opup.*",
      "^(open|close|show|hide|toggle)[A-Z].*[Dd]rawer.*",
      "^modal[A-Z].*",
      "^dialog[A-Z].*",
      "^popup[A-Z].*",
    ],
    description: "🔍 Modals - Modal windows, dialogs, and overlays",
  },
  "watchers-listeners": {
    patterns: [
      "watch",
      "watchEffect",
      "watchPostEffect",
      "watchSyncEffect",
      "watchIgnorable",
      "watchOnce",
      "watchDeep",
      "watchImmediate",
      "addEventListener",
      "removeEventListener",
      "useEventListener",
      "useDocumentListener",
      "useWindowListener",
      "useResizeObserver",
      "useMutationObserver",
      "useIntersectionObserver",
      "^(listen|unlisten|subscribe|unsubscribe)[A-Z].*",
      "^(on|off|emit|trigger)[A-Z].*",
    ],
    description:
      "👀 Watchers & Listeners - Watchers, observers, and event listeners",
  },
  "app-lifecycle": {
    patterns: [
      "onBeforeMount",
      "onMounted",
      "onBeforeUpdate",
      "onUpdated",
      "onBeforeUnmount",
      "onUnmounted",
      "onActivated",
      "onDeactivated",
      "onErrorCaptured",
      "onBeforeRouteLeave",
      "onBeforeRouteUpdate",
      "definePageMeta",
      "defineRouteRules",
      "defineNuxtConfig",
      "defineNuxtPlugin",
      "defineAppConfig",
    ],
    description:
      "🔄 App Lifecycle - Vue lifecycle hooks and framework configuration",
  },
};

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

function extractFunctionCall(lineText: string): string | null {
  // Паттерны для поиска вызовов функций
  const patterns = [
    // const data = useData()
    /const\s+[\w\{\}\[\],\s]+\s*=\s*(?:await\s+)?(\w+)\s*\(/,
    // let result = await useFetch()
    /let\s+[\w\{\}\[\],\s]+\s*=\s*(?:await\s+)?(\w+)\s*\(/,
    // var info = someFunction()
    /var\s+[\w\{\}\[\],\s]+\s*=\s*(?:await\s+)?(\w+)\s*\(/,
    // Деструктуризация: const { data } = useQuery()
    /const\s*\{[^}]+\}\s*=\s*(?:await\s+)?(\w+)\s*\(/,
    // Массив деструктуризация: const [state, setState] = useState()
    /const\s*\[[^\]]+\]\s*=\s*(?:await\s+)?(\w+)\s*\(/,
    // Прямой вызов в выражении
    /(\w+)\s*\(/,
  ];

  for (const pattern of patterns) {
    const match = lineText.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function getCategoryForFunction(
  word: string,
  lineText: string
): CategoryResult | null {
  // Сначала проверяем само слово
  let group = findGroupByPattern(word, defaultGroups);

  // Если не найдено, пытаемся найти функцию в контексте строки
  if (!group) {
    const functionCall = extractFunctionCall(lineText);
    if (functionCall) {
      group = findGroupByPattern(functionCall, defaultGroups);
    }
  }

  // Если группа все еще не найдена, используем fallback к app-functions
  if (!group) {
    group = "app-functions";
  }

  const groupConfig = defaultGroups[group];
  const order = defaultOrder.indexOf(group);

  return {
    name: group,
    description: groupConfig.description,
    order: order !== -1 ? order : undefined,
  };
}
