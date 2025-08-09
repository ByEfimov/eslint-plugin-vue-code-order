const { RuleTester } = require("eslint");
const rule = require("../lib/rules/vue-script-setup-order").default;

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

ruleTester.run("vue-script-setup-order", rule, {
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
    // Test для fallback к app-functions - правильный порядок
    {
      filename: "test-fallback-valid.vue",
      code: `
<template>
  <div>Test</div>
</template>

<script setup lang="ts">
// Framework initialization
const route = useRoute();

// Variables
const message = ref('Hello');

// Unknown functions classified as app-functions - правильный порядок
const customFunction = () => {};
const anotherCustomFunction = () => {};
const unknownVariable = someUnknownFunction();

// App lifecycle должен быть в конце
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
    // Test для fallback к app-functions - неправильный порядок
    {
      filename: "test-fallback.vue",
      code: `
<template>
  <div>Test</div>
</template>

<script setup lang="ts">
// Framework initialization
const route = useRoute();

// Variables
const message = ref('Hello');

// App lifecycle - неправильно, должен быть после app-functions
onMounted(() => {});

// Unknown functions should be classified as app-functions и идти ПОСЛЕ lifecycle
const customFunction = () => {};
const anotherCustomFunction = () => {};
const unknownVariable = someUnknownFunction();
</script>
      `,
      errors: [
        {
          messageId: "incorrectOrder",
        },
        {
          messageId: "incorrectOrder",
        },
        {
          messageId: "incorrectOrder",
        },
      ],
    },
  ],
});

console.log("All tests passed!");
