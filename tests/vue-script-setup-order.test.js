const { RuleTester } = require('eslint');
const rule = require('../lib/rules/vue-script-setup-order-simple').default;

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: {
      ts: '@typescript-eslint/parser',
    },
  },
});

ruleTester.run('vue-script-setup-order', rule, {
  valid: [
    {
      filename: 'test.vue',
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
      filename: 'test2.vue', 
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
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
// Неправильный порядок - stores перед framework init
const authStore = useAuthStore();
const route = useRoute();

const message = ref('Hello');
</script>
      `,
      errors: [
        {
          messageId: 'incorrectOrder',
          data: {
            expectedGroup: 'Store initialization',
            actualGroup: 'Framework initialization functions'
          }
        }
      ],
    },

    {
      filename: 'test.vue',
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
          messageId: 'incorrectOrder'
        }
      ],
    },
  ],
});

console.log('All tests passed!');
