# ESLint Plugin Vue Code Order

<img src="icon.png" alt="Plugin Icon" width="64" height="64" align="left">

ESLint плагин для автоматической проверки и обеспечения правильного порядка кода в Vue файлах с `<script setup>`. Помогает поддерживать чистоту и читаемость кода в ваших Vue.js проектах.

<br clear="left"/>

## 🚀 Установка

```bash
npm install --save-dev eslint-plugin-vue-code-order
```

## 📋 Быстрый старт

### Базовая настройка

В вашем `.eslintrc.js`:

```javascript
module.exports = {
  plugins: ["vue-code-order"],
  rules: {
    "vue-code-order/vue-script-setup-order": "error",
  },
};
```

### Готовые конфигурации

**Рекомендуемая конфигурация:**

```javascript
module.exports = {
  extends: ["plugin:vue-code-order/recommended"],
};
```

**Строгий режим:**

```javascript
module.exports = {
  extends: ["plugin:vue-code-order/strict"],
};
```

## 🎯 Как это работает

Плагин проверяет порядок кода в блоках `<script setup>` и предупреждает о нарушениях. Он помогает поддерживать единообразную структуру кода во всем проекте.

### Правильный порядок кода:

1. **🔧 Framework initialization** - Инициализация фреймворка

   ```javascript
   const { $moment } = useNuxtApp();
   const route = useRoute();
   ```

2. **🏪 Stores** - Инициализация сторов

   ```javascript
   const authStore = useAuthStore();
   const userStore = useUserStore();
   ```

3. **📚 Libraries** - Импорты и инициализация библиотек

   ```javascript
   import { useModal } from "vue-final-modal";
   const { copy } = useClipboard();
   ```

4. **📊 Variables** - Реактивные переменные

   ```javascript
   const userData = ref({});
   const isLoading = ref(false);
   ```

5. **🔄 Computed & Custom Hooks** - Вычисляемые свойства и кастомные хуки

   ```javascript
   const fullName = computed(() => `${user.firstName} ${user.lastName}`);
   const { filteredData } = useFilter(data);
   ```

6. **🌐 Server Requests** - Запросы к серверу

   ```javascript
   const { data: users } = await useAsyncData("users", () => fetchUsers());
   ```

7. **⚡ App Functions** - Функции приложения

   ```javascript
   const handleSubmit = () => {
     // логика обработки
   };
   ```

8. **🔍 Modals** - Работа с модальными окнами

   ```javascript
   const openModal = () => {
     const { open } = useModal({ component: MyModal });
     open();
   };
   ```

9. **👀 Watchers & Listeners** - Наблюдатели и слушатели

   ```javascript
   watch(userId, (newId) => {
     loadUserData(newId);
   });
   ```

10. **🔄 App Lifecycle** - Жизненный цикл приложения

    ```javascript
    onMounted(() => {
      initializeApp();
    });

    definePageMeta({
      auth: true,
    });
    ```

## ⚙️ Настройка

### Кастомизация порядка групп

```javascript
{
  "vue-code-order/vue-script-setup-order": ["error", {
    "order": [
      "imports",
      "types",
      "framework-init",
      "stores",
      "libraries",
      "variables",
      "computed-hooks",
      "server-requests",
      "app-functions",
      "modals",
      "watchers-listeners",
      "app-lifecycle"
    ]
  }]
}
```

### Добавление пользовательских групп

```javascript
{
  "vue-code-order/vue-script-setup-order": ["error", {
    "order": [
      "imports",
      "types",
      "framework-init",
      "stores",
      "analytics", // ваша группа
      "libraries",
      // остальные группы...
    ],
    "groups": {
      "analytics": {
        "patterns": [
          "useGoogleAnalytics",
          "useYandexMetrica",
          "trackEvent.*"
        ],
        "description": "Analytics services"
      }
    }
  }]
}
```

### Расширение существующих групп

```javascript
{
  "vue-code-order/vue-script-setup-order": ["error", {
    "groups": {
      "libraries": {
        "patterns": [
          // базовые паттерны сохраняются
          "useMyCustomLibrary", // добавляем новый
          "myCompanyFramework.*"
        ]
      }
    }
  }]
}
```

### Работа с циклическими зависимостями

#### allowCyclicDependencies

Позволяет разрешить циклические зависимости между группами. По умолчанию: `false`.

```javascript
{
  "vue-code-order/vue-script-setup-order": ["error", {
    "allowCyclicDependencies": true
  }]
}
```

**Пример использования:**

```vue
<script setup lang="ts">
// Без allowCyclicDependencies: true - будет ошибка
const userStore = useUserStore(); // stores группа
const computedData = computed(() => userStore.data); // computed-hooks группа

const apiClient = createApiClient(); // libraries группа
const processedData = computed(() => apiClient.process(computedData.value)); // циклическая зависимость
</script>
```

#### skipDependencyCheck

Позволяет полностью пропустить проверку зависимостей для указанных групп.

```javascript
{
  "vue-code-order/vue-script-setup-order": ["error", {
    "skipDependencyCheck": ["libraries", "computed-hooks"]
  }]
}
```

**Когда использовать:**

- При работе со сложными композаблами
- Для групп с множественными взаимосвязями
- При рефакторинге legacy кода

**Пример:**

```javascript
{
  "vue-code-order/vue-script-setup-order": ["error", {
    "order": [
      "imports",
      "framework-init",
      "stores",
      "libraries",
      "computed-hooks"
    ],
    "skipDependencyCheck": ["libraries"], // библиотеки могут использоваться в любом порядке
    "allowCyclicDependencies": true // разрешить циклические зависимости между остальными группами
  }]
}
```

## 📖 Пример

**❌ Неправильно:**

```vue
<script setup lang="ts">
// Функция идет перед инициализацией stores
const handleClick = () => console.log("clicked");

// Store инициализируется после функций
const userStore = useUserStore();

// Route инициализируется в конце
const route = useRoute();
</script>
```

**✅ Правильно:**

```vue
<script setup lang="ts">
// 1. Framework initialization
const route = useRoute();

// 2. Stores
const userStore = useUserStore();

// 3. App functions
const handleClick = () => console.log("clicked");
</script>
```

## 🔧 Совместимость

- **ESLint**: >= 8.0.0
- **Vue**: >= 3.0.0
- **Node.js**: >= 16.0.0

## 📝 Лицензия

MIT

## 🤝 Поддержка

Если у вас есть вопросы или предложения, создайте [issue](https://github.com/ByEfimov/eslint-plugin-vue-code-order/issues) в репозитории.
