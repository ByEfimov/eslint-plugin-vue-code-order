# 🎯 Быстрый старт: Vue Code Order Hover

Это расширение VS Code добавляет возможность видеть категории функций при наведении курсора в Vue файлах с `<script setup>`.

## 📦 Что получите

При наведении на любую функцию в Vue файле вы увидите:

- **Название категории** (например, "framework-init")
- **Описание категории** с эмодзи (например, "🔧 Framework initialization")
- **Позицию в рекомендуемом порядке** (например, "Order position: 3")

## 🚀 Установка

```bash
# 1. Перейдите в папку расширения
cd vscode-extension

# 2. Установите зависимости
npm install

# 3. Скомпилируйте TypeScript
npm run compile

# 4. Откройте VS Code в этой папке
code .

# 5. Нажмите F5 для запуска в режиме отладки
```

## ✨ Пример использования

Откройте файл `test-example.vue` и наведите курсор на:

### Framework Initialization

```javascript
const route = useRoute(); // 🔧 Framework initialization - Order: 3
const router = useRouter();
```

### Stores

```javascript
const userStore = useUserStore(); // 🏪 Stores - Order: 4
const authStore = useAuthStore();
```

### Variables

```javascript
const pageTitle = ref("Test Page"); // 📊 Variables - Order: 9
const userInfo = reactive({});
```

### Computed & Custom Hooks

```javascript
const fullUserInfo = computed(() => `${name}`); // 🔄 Computed & Custom Hooks - Order: 11
```

### Server Requests

```javascript
const { data } = await useAsyncData(); // 🌐 Server Requests - Order: 10
```

### App Functions

```javascript
const handleSubmit = () => {}; // ⚡ App Functions - Order: 12
```

### Modals

```javascript
const openModal = () => {}; // 🔍 Modals - Order: 13
```

### Watchers & Listeners

```javascript
watch(userInfo, (newValue) => {}); // 👀 Watchers & Listeners - Order: 14
```

### App Lifecycle

```javascript
onMounted(() => {}); // 🔄 App Lifecycle - Order: 15
```

## ⚙️ Настройки

Откройте настройки VS Code (`Cmd/Ctrl + ,`) и найдите:

- `vueCodeOrderHover.enabled` - Включить/выключить hover tooltips
- `vueCodeOrderHover.showDescription` - Показывать описание категории

## 🔧 Интеграция с ESLint

Расширение использует ту же логику категоризации, что и ESLint плагин:

```javascript
// .eslintrc.js
module.exports = {
  plugins: ["vue-code-order"],
  rules: {
    "vue-code-order/vue-script-setup-order": "error",
  },
};
```

## 📊 Поддерживаемые категории (в порядке расположения)

1. **🔧 Framework initialization** - useRoute, useRouter, useNuxtApp
2. **🏪 Stores** - useStore, Pinia stores
3. **🎨 UI Libraries** - useQuasar, useToast, useModal
4. **📚 Libraries** - useClipboard, useLocalStorage, useAxios
5. **🛠️ Utils** - utility functions and helpers
6. **✅ Validation** - useVuelidate, validation schemas
7. **📊 Variables** - ref, reactive, readonly
8. **🌐 Server Requests** - useAsyncData, useFetch, API calls
9. **🔄 Computed & Custom Hooks** - computed, custom composables
10. **⚡ App Functions** - event handlers, app logic
11. **🔍 Modals** - modal operations
12. **👀 Watchers & Listeners** - watch, event listeners
13. **🔄 App Lifecycle** - onMounted, lifecycle hooks

## 🎨 Кастомизация

Чтобы добавить свои паттерны или категории, отредактируйте:

- `src/categoryDetector.ts` - логика категоризации
- `defaultGroups` - конфигурация групп и паттернов

После изменений выполните `npm run compile` и перезапустите расширение.

## 🤝 Поддержка

Если что-то не работает:

1. Проверьте консоль разработчика (`Help > Toggle Developer Tools`)
2. Убедитесь, что курсор находится в `<script setup>` блоке
3. Проверьте, что функция соответствует одному из паттернов

Создайте [issue](https://github.com/ByEfimov/eslint-plugin-vue-code-order/issues) если нужна помощь!
