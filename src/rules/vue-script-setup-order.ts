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
  order?: string[];
  groups?: Record<string, GroupConfig>;
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

      // VueUse Core
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
      "useDeviceOrientation",
      "useDeviceMotion",
      "useEventSource",
      "useWebSocket",
      "useWebWorker",
      "useBroadcastChannel",
      "useEventListener",
      "useResizeObserver",
      "useMutationObserver",
      "useIntersectionObserver",
      "useElementSize",
      "useElementVisibility",
      "useWindowSize",
      "useWindowScroll",
      "useDocumentVisibility",
      "useFocus",
      "useFocusWithin",
      "useActiveElement",
      "useMouse",
      "useMouseInElement",
      "useMousePressed",
      "usePointer",
      "useKeyModifier",
      "useMagicKeys",
      "useTextSelection",
      "useDropZone",
      "useFileDialog",
      "useImage",
      "usePreferredColorScheme",
      "usePreferredLanguages",
      "useDark",
      "useStorage",
      "useLocalStorage",
      "useSessionStorage",
      "useCookies",
      "useUrlSearchParams",
      "useBase64",
      "useTextDirection",
      "useBrowserLocation",
      "useManualRefHistory",
      "useRefHistory",
      "useAsyncQueue",
      "useInterval",
      "useIntervalFn",
      "useTimeout",
      "useTimeoutFn",
      "useTimestamp",
      "useNow",
      "useDateFormat",
      "useTimeAgo",
      "useMemoize",
      "useAsyncState",
      "usePromise",
      "useTransition",
      "useCssVar",
      "useStyleTag",
      "usePreferredReducedMotion",
      "useEyeDropper",
      "useTextareaAutosize",
      "useVModel",
      "useVModels",
      "useFetch",
      "useLazyFetch",

      // Animation & Transition
      "useSpring",
      "useMotion",
      "useAnimate",
      "useTransform",
      "useInView",
      "useScroll",
      "useDragControls",
      "useMotionValue",

      // Form & Validation Libraries
      "useFormik",
      "useFormState",
      "useFieldArray",
      "useController",
      "useWatch",
      "useFormikContext",

      // Date & Time Libraries
      "useMoment",
      "useDayjs",
      "useDateFns",
      "useLuxon",

      // HTTP Clients
      "useAxios",
      "useSWR",
      "useQuery",
      "useMutation",
      "useInfiniteQuery",
      "useApollo",
      "useGraphQL",
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
      "escape",
      "unescape",
      "parseJSON",
      "stringify",
      "deepClone",
      "merge",
      "omit",
      "pick",
      "groupBy",
      "sortBy",
      "uniq",
      "flatten",
      "chunk",
      "isEqual",
      "isEmpty",
      "isArray",
      "isObject",
      "isString",
      "isNumber",
      "isBoolean",
      "isFunction",
      "isDate",
      "isRegExp",
      "isNull",
      "isUndefined",
      "isDefined",
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
      "useAjv",
      "useSuperstruct",
      "useIo",
      "validate",
      "validateForm",
      "validateField",
      "validateEmail",
      "validatePassword",
      "validatePhone",
      "validateURL",
      "validateRequired",
      "validateMin",
      "validateMax",
      "validateMinLength",
      "validateMaxLength",
      "validatePattern",
      "validateCustom",
      "createValidator",
      "defineRules",
      "defineValidation",
    ],
    description: "Validation libraries and schemas",
  },
  variables: {
    patterns: [
      // Common variable patterns
      "^(message|loading|data|config|options|dateRange|buttonOptions|isLoading|isError|error|result|response|payload|params|query|body|headers|status|state|form|formData|formState|formRef|modalRef|dialogRef|tableRef|listRef|inputRef|buttonRef|containerRef|elementRef)$",
      "^(show|hide|open|close|active|inactive|visible|hidden|enabled|disabled|selected|checked|expanded|collapsed|readonly|editable)$",
      "^(current|selected|active|focused|hovered|pressed|dragging|resizing|loading|pending|success|error|warning|info)$",
      "^(items|list|data|collection|records|entries|results|values|keys|options|choices|selections|blocks)$",
      "^(text|content|value|name|title|label|description|message|note|comment|placeholder|hint|tooltip)$",
      "^(count|total|length|size|width|height|top|left|right|bottom|x|y|offset|position|index|page|limit|skip)$",
      "^(id|uuid|key|token|hash|signature|checksum|version|timestamp|date|time|duration|delay|timeout|interval)$",
      "^(url|uri|link|href|src|path|route|endpoint|api|base|prefix|suffix|extension|mime|type|format)$",
      "^(min|max|step|precision|scale|factor|ratio|percent|percentage|angle|radius|diameter|area|volume)$",
      "^(theme|color|background|foreground|primary|secondary|accent|success|warning|error|info|muted|disabled)$",
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

      // Server-side utilities
      "useRequestHeaders",
      "useRequestEvent",
      "useCookie",
      "useStorage",

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

      // File uploads
      "useFileUpload",
      "useImageUpload",
      "useMultipleFileUpload",
      "useDragAndDropUpload",

      // WebSocket & Real-time
      "useWebSocket",
      "useWebSocketConnection",
      "useSocketIO",
      "useEventSource",
      "useServerSentEvents",
      "usePusher",
      "useAbly",

      // Background jobs & polling
      "usePolling",
      "useInterval",
      "useBackgroundFetch",
      "usePeriodicFetch",

      // Request interceptors & middleware
      "useRequestInterceptor",
      "useResponseInterceptor",
      "useAuthToken",
      "useApiKey",
      "useBearerToken",
      "useRequestMiddleware",
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
      "useAggregate",
      "useMap",
      "useReduce",
      "useFind",
      "useFindIndex",
      "useIncludes",
      "useSome",
      "useEvery",
      "useForEach",

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

      // Complex computed patterns
      "useComputedAsync",
      "useAsyncComputed",
      "useLazyComputed",
      "useMemoizedComputed",
      "useDebouncedComputed",
      "useThrottledComputed",

      // Business logic hooks
      "useBusinessLogic",
      "useCalculation",
      "useValidation",
      "useFormatter",
      "useConverter",
      "useTransformer",
      "useParser",
      "useSerializer",

      // Reactive computed chains
      "useChainedComputed",
      "usePipelineComputed",
      "useComputedPipeline",
      "useReactiveChain",
    ],
    description: "Computed properties and custom hooks",
  },
  "app-functions": {
    patterns: [
      // Event handlers
      "^handle[A-Z].*",
      "^on(Click|Submit|Change|Input|Focus|Blur|Key|Mouse|Touch|Drag|Drop|Scroll|Resize|Load|Error)[A-Z].*",
      "^(click|submit|change|input|focus|blur|keydown|keyup|keypress|mousedown|mouseup|mouseover|mouseout|mouseenter|mouseleave|drag|drop|scroll|resize|load|error)[A-Z].*",

      // CRUD operations
      "^(create|add|insert)[A-Z].*",
      "^(read|get|fetch|load|retrieve)[A-Z].*",
      "^(update|edit|modify|change|set)[A-Z].*",
      "^(delete|remove|destroy|clear)[A-Z].*",

      // Navigation & routing
      "^(navigate|goto|redirect|push|replace|back|forward)[A-Z].*",
      "^(route|router)[A-Z].*",

      // Form operations
      "^(validate|submit|reset|clear|populate|autofill)[A-Z].*",
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

      // File operations
      "^(upload|download|import|export|print)[A-Z].*",
      "^(compress|decompress|resize|crop|rotate)[A-Z].*",

      // Authentication & authorization
      "^(login|logout|signin|signout|register|signup)[A-Z].*",
      "^(authenticate|authorize|verify|validate)[A-Z].*",

      // Notification & messaging
      "^(notify|alert|toast|message|broadcast)[A-Z].*",
      "^(send|receive|subscribe|unsubscribe)[A-Z].*",

      // Animation & effects
      "^(animate|transition|fade|slide|zoom|rotate)[A-Z].*",
      "^(start|stop|pause|resume|replay)[A-Z].*",

      // API & external services
      "^(api|service|client)[A-Z].*",
      "^(sync|backup|restore|migrate)[A-Z].*",

      // Configuration & settings
      "^(configure|setup|initialize|destroy|teardown)[A-Z].*",
      "^(enable|disable|activate|deactivate)[A-Z].*Feature",

      // Utility functions
      "^(format|parse|convert|transform|encode|decode)[A-Z].*",
      "^(generate|create|build|construct|factory)[A-Z].*",

      // Debugging & logging
      "^(log|debug|trace|info|warn|error)[A-Z].*",
      "^(measure|benchmark|profile|monitor)[A-Z].*",
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
      "^(open|close|show|hide|toggle)[A-Z].*[Tt]ooltip.*",
      "^(open|close|show|hide|toggle)[A-Z].*[Pp]opover.*",
      "^(open|close|show|hide|toggle)[A-Z].*[Dd]ropdown.*",
      "^(open|close|show|hide|toggle)[A-Z].*[Mm]enu.*",
      "^(open|close|show|hide|toggle)[A-Z].*[Aa]ccordion.*",
      "^(open|close|show|hide|toggle)[A-Z].*[Tt]ab.*",
      "^(open|close|show|hide|toggle)[A-Z].*[Cc]ollapse.*",

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
      "^(open|close|show|hide)[A-Z].*[Cc]onfiguration.*",
      "^(open|close|show|hide)[A-Z].*[Uu]pload.*",
      "^(open|close|show|hide)[A-Z].*[Dd]ownload.*",
      "^(open|close|show|hide)[A-Z].*[Ii]mport.*",
      "^(open|close|show|hide)[A-Z].*[Ee]xport.*",
      "^(open|close|show|hide)[A-Z].*[Ss]hare.*",
      "^(open|close|show|hide)[A-Z].*[Hh]elp.*",
      "^(open|close|show|hide)[A-Z].*[Aa]bout.*",

      // Modal state management
      "^(show|hide|toggle|set)[A-Z].*[Mm]odal",
      "^(activate|deactivate)[A-Z].*[Mm]odal",
      "^(enable|disable)[A-Z].*[Mm]odal",
      "^modal[A-Z].*",
      "^dialog[A-Z].*",
      "^popup[A-Z].*",
      "^drawer[A-Z].*",
      "^sidebar[A-Z].*",
      "^overlay[A-Z].*",

      // Modal utilities
      "^(create|destroy|mount|unmount)[A-Z].*[Mm]odal",
      "^(register|unregister)[A-Z].*[Mm]odal",
      "^(stack|queue)[A-Z].*[Mm]odal",
      "^(focus|blur)[A-Z].*[Mm]odal",
      "^(lock|unlock)[A-Z].*[Ss]croll",
      "^(prevent|allow)[A-Z].*[Bb]ackground",
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
      "watchArray",
      "watchWithFilter",
      "watchPausable",
      "watchTriggerable",

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
      "^(handle|process)[A-Z].*Event",

      // DOM observers
      "useResizeObserver",
      "useMutationObserver",
      "useIntersectionObserver",
      "usePerformanceObserver",
      "useReportingObserver",

      // Media queries & device events
      "useMediaQuery",
      "useBreakpoints",
      "useDeviceOrientation",
      "useDeviceMotion",
      "useGeolocation",
      "useBattery",
      "useNetwork",
      "useOnline",
      "useIdle",
      "usePageLeave",
      "useDocumentVisibility",
      "useFocus",
      "useFocusWithin",
      "useActiveElement",

      // Mouse & keyboard events
      "useMouse",
      "useMouseInElement",
      "useMousePressed",
      "usePointer",
      "usePointerLock",
      "useSwipe",
      "usePinch",
      "useWheel",
      "useKeyModifier",
      "useMagicKeys",
      "useKeyboard",
      "useHotkey",
      "useShortcut",

      // Touch & gesture events
      "useTouch",
      "useGesture",
      "useDrag",
      "useDrop",
      "useDropZone",
      "usePinchZoom",
      "useRotate",
      "useLongPress",
      "useDoubleClick",

      // Scroll events
      "useScroll",
      "useWindowScroll",
      "useElementScroll",
      "useScrollDirection",
      "useScrollTop",
      "useScrollLeft",
      "useInfiniteScroll",
      "useVirtualScroll",
      "useParallax",

      // Form events
      "useFormEvents",
      "useInput",
      "useInputEvents",
      "useFormValidation",
      "useFieldValidation",
      "useSubmitHandler",
      "useChangeHandler",

      // WebSocket & real-time events
      "useWebSocket",
      "useSocketIO",
      "useEventSource",
      "useServerSentEvents",
      "useBroadcastChannel",
      "useMessageChannel",
      "useWorkerMessage",

      // File system events
      "useFileSystemWatcher",
      "useFileChange",
      "useDirectoryWatcher",

      // Browser events
      "useBeforeUnload",
      "useUnload",
      "usePopstate",
      "useHashChange",
      "useStorage",
      "useStorageChange",
      "useCookieChange",
      "usePermissionChange",
      "useClipboardChange",

      // Custom watchers
      "useRouteWatcher",
      "useStoreWatcher",
      "useStateWatcher",
      "useDataWatcher",
      "useAsyncWatcher",
      "useConditionalWatcher",
      "useDelayedWatcher",
      "useRateLimitedWatcher",
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
      "onRenderTracked",
      "onRenderTriggered",
      "onServerPrefetch",

      // Nuxt lifecycle hooks
      "onBeforeRouteLeave",
      "onBeforeRouteUpdate",
      "definePageMeta",
      "defineRouteRules",
      "defineNuxtConfig",
      "defineNuxtPlugin",
      "defineAppConfig",

      // Custom lifecycle hooks
      "useLifecycle",
      "useMount",
      "useUnmount",
      "useUpdate",
      "useAsyncMount",
      "useAsyncUnmount",
      "useCleanup",
      "useDispose",
      "useTeardown",
      "useInitialize",
      "useSetup",
      "useDestroy",

      // Component lifecycle
      "useComponentLifecycle",
      "useComponentMount",
      "useComponentUnmount",
      "useComponentUpdate",
      "useComponentActivation",
      "useComponentDeactivation",

      // Application lifecycle
      "useAppLifecycle",
      "useAppMount",
      "useAppUnmount",
      "useAppStart",
      "useAppStop",
      "useAppPause",
      "useAppResume",
      "useAppBackground",
      "useAppForeground",

      // Route lifecycle
      "useRouteLifecycle",
      "useRouteEnter",
      "useRouteLeave",
      "useRouteUpdate",
      "useRouteGuard",
      "useNavigation",
      "useNavigationGuard",

      // Page lifecycle
      "usePageLifecycle",
      "usePageEnter",
      "usePageLeave",
      "usePageShow",
      "usePageHide",
      "usePageLoad",
      "usePageUnload",
      "usePageReload",
      "usePageRefresh",

      // SEO & Meta
      "useSeoMeta",
      "useServerSeoMeta",
      "useHead",
      "useHeadSafe",
      "useTitleTemplate",
      "useJsonld",
      "useSchemaOrg",

      // Error handling
      "useErrorHandler",
      "useGlobalErrorHandler",
      "useAsyncErrorHandler",
      "useErrorBoundary",
      "useErrorCapture",
      "useUnhandledRejection",

      // Performance & optimization
      "usePreload",
      "usePrefetch",
      "useLazyHydration",
      "useHydration",
      "useSSR",
      "useClientOnly",
      "useAsyncComponent",

      // Development & debugging
      "useDevtools",
      "useHMR",
      "useLogger",
      "useDebugger",
      "useProfiler",
      "usePerformanceMonitor",
    ],
    description: "App lifecycle, SEO, and framework hooks",
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

function getGroupIndex(group: string | null, order: string[]): number {
  if (!group) return order.length;
  const index = order.indexOf(group);
  return index === -1 ? order.length : index;
}

function mergeGroups(
  defaultGroups: Record<string, GroupConfig>,
  userGroups?: Record<string, GroupConfig>
): Record<string, GroupConfig> {
  if (!userGroups) {
    return defaultGroups;
  }

  const merged = { ...defaultGroups };

  for (const [groupName, groupConfig] of Object.entries(userGroups)) {
    if (merged[groupName]) {
      // Если группа уже существует, объединяем паттерны
      merged[groupName] = {
        patterns: [...merged[groupName].patterns, ...groupConfig.patterns],
        description: groupConfig.description || merged[groupName].description,
      };
    } else {
      // Если группа новая, добавляем её
      merged[groupName] = {
        patterns: [...groupConfig.patterns],
        description: groupConfig.description || `Custom group: ${groupName}`,
      };
    }
  }

  return merged;
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
    const groups = mergeGroups(defaultGroups, options.groups);

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
