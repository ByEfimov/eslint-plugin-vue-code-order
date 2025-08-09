import vueScriptSetupOrder from './rules/vue-script-setup-order-simple';

const plugin = {
  meta: {
    name: 'eslint-plugin-vue-code-order',
    version: '1.0.0'
  },
  
  rules: {
    'vue-script-setup-order': vueScriptSetupOrder,
  },

  configs: {
    recommended: {
      plugins: ['vue-code-order'],
      rules: {
        'vue-code-order/vue-script-setup-order': 'error'
      },
      parser: 'vue-eslint-parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        parser: '@typescript-eslint/parser'
      }
    },
    
    strict: {
      plugins: ['vue-code-order'],
      rules: {
        'vue-code-order/vue-script-setup-order': ['error', {
          order: [
            'framework-init',
            'stores', 
            'libraries',
            'variables',
            'computed-hooks',
            'server-requests',
            'app-functions',
            'modals',
            'watchers-listeners',
            'app-lifecycle'
          ]
        }]
      },
      parser: 'vue-eslint-parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        parser: '@typescript-eslint/parser'
      }
    }
  }
};

export = plugin;
