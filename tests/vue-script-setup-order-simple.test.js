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

// Server request - зависит от computed (будет создана циклическая зависимость)
const serverData = await useFetch('/api/items', {
  query: computedQuery
});

// Computed hook - зависит от server request (создается цикл)
const computedQuery = computed(() => {
  return { filter: searchQuery.value, processedData: serverData.value };
});

// Variables  
const result = ref('test');
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
      options: [{ skipDependencyCheck: ['libraries'] }],
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

console.log("All tests passed!");
