const { RuleTester } = require("eslint");
const rule = require("../lib/rules/vue-script-setup-order-simple").default;

const ruleTester = new RuleTester({
  parser: require.resolve("vue-eslint-parser"),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    parser: {
      ts: "@typescript-eslint/parser",
    },
  },
});

ruleTester.run("vue-script-setup-order-simple", rule, {
  valid: [
    {
      filename: "test.vue",
      code: `
<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
// Простой тест - только одна группа
const route = useRoute();
</script>
      `,
    },
    {
      filename: "test2.vue",
      code: `
<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
// Правильный порядок
const route = useRoute();
const authStore = useAuthStore();
const message = ref('Hello');
</script>
      `,
    },
    {
      filename: "test-basic.vue",
      code: `
<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const route = useRoute();
const authStore = useAuthStore();
const message = ref('Hello');
const fullName = computed(() => message.value);
const handleClick = () => {};
watch(message, () => {});
onMounted(() => {});
</script>
      `,
    },
    {
      filename: "test-with-cyclic-dependency-allowed.vue",
      code: `
<template>
  <div>{{ result }}</div>
</template>

<script setup lang="ts">
// Libraries
const searchQuery = ref('initial');

// Variables  
const variableValue = ref('test');

// Server request - зависит от computed (будет создана циклическая зависимость)
const serverData = await useFetch('/api/items', {
  query: computedQuery
});

// Computed hook - зависит от server request (создается цикл)
const computedQuery = computed(() => {
  return { filter: searchQuery.value, processedData: serverData.value };
});
</script>
      `,
      options: [{ allowCyclicDependencies: true }],
    },
    {
      filename: "test-with-eslint-disable.vue",
      code: `
<template>
  <div>{{ filteredData.length }} items</div>
</template>

<script setup lang="ts">
// Server request
const { data } = await useFetch('/api/items');

// eslint-disable-next-line vue-script-setup-order-simple
const searchQuery = ref(''); // Libraries после server-requests

// Computed hooks
const filteredData = computed(() => {
  return data.value?.filter(item => item.name.includes(searchQuery.value)) || [];
});
</script>
      `,
    },
    {
      filename: "test-skip-dependency-check.vue",
      code: `
<template>
  <div>{{ filteredData.length }} items</div>
</template>

<script setup lang="ts">
// Server request
const { data } = await useFetch('/api/items');

// Libraries (группа libraries в skipDependencyCheck) 
const searchQuery = ref('');

// Computed hooks
const filteredData = computed(() => {
  return data.value?.filter(item => item.name.includes(searchQuery.value)) || [];
});
</script>
      `,
      options: [{ skipDependencyCheck: ["libraries"] }],
    },
    {
      filename: "test-universal-cyclic-dependencies.vue",
      code: `
<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
// Циклические зависимости между любыми категориями - libraries и variables
const dynamicRef = ref(variableValue);  // libraries зависит от variables

const variableValue = dynamicRef.value || 'default';  // variables зависит от libraries

const message = ref('hello');
</script>
      `,
      options: [{ allowCyclicDependencies: true }],
    },
    {
      filename: "test-selective-cyclic-dependencies.vue",
      code: `
<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
// Libraries group
const message = ref('Hello'); // libraries group

// Циклические зависимости между variables и computed-hooks (будут игнорироваться)
const variableValue = ref(computedValue.value + 1); // variables group, зависит от computed-hooks

// Server-requests group
const data = await useFetch('/api/data'); // server-requests group

// Computed-hooks group
const computedValue = computed(() => variableValue.value ? 10 : 20); // computed-hooks group, зависит от variables
</script>
      `,
      options: [{ allowCyclicDependencies: true }],
    },
    {
      filename: "test-complex-component.vue",
      code: `
<template>
  <div>
    <component v-for="block in blocks" :key="block.name" :is="block.component" />
  </div>
</template>

<script setup lang="ts">
// Libraries
const blockRefs = reactive<Record<string, HTMLElement>>({});

// Variables
const blocks = [
  { name: 'statistic', title: 'Статистика', component: Statistic },
  { name: 'calendar', title: 'Календарь', component: Calendar },
  { name: 'goals', title: 'Цели', component: Goals },
  { name: 'vectors', title: 'Векторы', component: Vectors },
  { name: 'player-statistic', title: 'Статистика игроков', component: PlayerStatistic },
];

// App lifecycle
definePageMeta({
  middleware: ['auth', 'route'],
  auth: true,
  route: 'index',
});
</script>
      `,
    },
    // Test с новыми функциями prepare* и apply* для простого правила
    {
      filename: "test-new-app-functions-simple.vue",
      code: `
<template>
  <div>Test</div>
</template>

<script setup lang="ts">
// Libraries
const players = ref([]);
const loading = ref(false);

// App-functions - prepare* и apply* функции
const prepareAssessmentData = (player: number, scoreData: IScoreData) => {
  return { sportsman: player };
};

const prepareMistakeData = (scoreData: IScoreData) => {
  return { comment: scoreData.comment };
};

const applyScore = async (): Promise<boolean> => {
  loading.value = true;
  try {
    return true;
  } finally {
    loading.value = false;
  }
};

// App lifecycle
onMounted(() => {});
</script>
      `,
    },
  ],

  invalid: [
    {
      filename: "test.vue",
      code: `
<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
// Framework init
const route = useRoute();

// Variables
const message = ref('Hello');

// Stores после variables - неправильно
const authStore = useAuthStore();

// Server requests
const { data } = await useAsyncData('test', () => {});
</script>
      `,
      errors: [
        {
          messageId: "incorrectOrder",
        },
      ],
    },

    {
      filename: "test-wrong-watchers.vue",
      code: `
<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
const route = useRoute();
const message = ref('Hello');

// Watchers
watch(message, () => {});

// App functions после watchers - неправильно
const handleClick = () => {};
</script>
      `,
      errors: [
        {
          messageId: "incorrectOrder",
        },
      ],
    },

    {
      filename: "test-simple-incorrect-order.vue",
      code: `
<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
// Server request
const { data } = await useFetch('/api/items');

// Libraries после server-requests - неправильно
const message = ref('Hello');
</script>
      `,
      errors: [
        {
          messageId: "incorrectOrder",
        },
      ],
    },
  ],
});

// Тесты для пользовательских категорий
ruleTester.run("vue-script-setup-order-simple with custom groups", rule, {
  valid: [
    {
      filename: "custom-group-test.vue",
      code: `
<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
// Правильный порядок с пользовательской группой
const route = useRoute();
const authStore = useAuthStore();
const analyticsService = useGoogleAnalytics();
const message = ref('Hello');
</script>
      `,
      options: [
        {
          order: ["framework-init", "stores", "my-analytics", "variables"],
          groups: {
            "my-analytics": {
              patterns: ["useGoogleAnalytics", "analyticsService.*"],
              description: "Analytics services",
            },
          },
        },
      ],
    },
    {
      filename: "simple-custom-group.vue",
      code: `
<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
// Простая проверка пользовательской группы
const customApi = useMyApi();
const data = ref(null);
</script>
      `,
      options: [
        {
          order: ["my-api", "variables"],
          groups: {
            "my-api": {
              patterns: ["useMyApi"],
              description: "My API functions",
            },
          },
        },
      ],
    },
  ],
  invalid: [
    {
      filename: "custom-group-wrong-order.vue",
      code: `
<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
// Неправильный порядок - variables перед analytics
const message = ref('Hello');
const analyticsService = useGoogleAnalytics();
</script>
      `,
      options: [
        {
          order: ["my-analytics", "variables"],
          groups: {
            "my-analytics": {
              patterns: ["useGoogleAnalytics"],
              description: "Analytics services",
            },
          },
        },
      ],
      errors: [
        {
          messageId: "incorrectOrder",
        },
      ],
    },
  ],
});

console.log("All tests passed!");
