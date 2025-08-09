# ESLint Plugin Vue Code Order

ESLint плагин для обеспечения правильного порядка кода в Vue файлах с `<script setup>`.

## Установка

```bash
npm install --save-dev eslint-plugin-vue-code-order
```

## Использование

### Базовая конфигурация

В вашем `.eslintrc.js`:

```javascript
module.exports = {
  plugins: ['vue-code-order'],
  rules: {
    'vue-code-order/vue-script-setup-order': 'error'
  }
};
```

### Использование готовых конфигураций

```javascript
module.exports = {
  extends: ['plugin:vue-code-order/recommended']
};
```

Или для строгого режима:

```javascript
module.exports = {
  extends: ['plugin:vue-code-order/strict']
};
```

## Правила

### `vue-script-setup-order`

Обеспечивает правильный порядок кода в блоках `<script setup>`.

#### Правильный порядок кода:

1. **Framework initialization** - Инициализация функций фреймворка
   - `useRoute`, `useRouter`, `useNuxtApp`, `useCookie`, `useRuntimeConfig`, etc.

2. **Stores** - Инициализация сторов
   - `useAuthStore`, `useEventsStore`, любые функции с паттерном `use.*Store`

3. **Libraries** - Инициализация библиотек
   - Vue Composition API (`ref`, `reactive`, `computed`), другие библиотеки

4. **Variables** - Переменные
   - Локальные переменные, реактивные данные

5. **Computed & Custom Hooks** - Computed свойства и кастомные хуки
   - `computed()`, кастомные композаблы

6. **Server Requests** - Запросы к серверу
   - `useAsyncData`, `useLazyAsyncData`, `useFetch`, `useLazyFetch`

7. **App Functions** - Функции приложения
   - Бизнес-логика, обработчики событий

8. **Modals** - Модальные окна
   - `useModal`, функции открытия/закрытия модалок

9. **Watchers & Listeners** - Наблюдатели и слушатели
   - `watch`, `watchEffect`, обработчики событий

10. **App Lifecycle** - Жизненный цикл приложения
    - `onMounted`, `onUnmounted`, `definePageMeta`, etc.

#### Пример правильного кода:

```vue
<template>
  <div class="root">
    <CalendarLeftMenu :events="events || []" />
  </div>
</template>

<script setup lang="ts">
// 1. Framework initialization
const { $moment } = useNuxtApp();
const route = useRoute();

// 2. Stores
const authStore = useAuthStore();
const eventsStore = useEventsStore();
const teamsStore = useTeamsStore();

// 3. Libraries
import { useModal } from "vue-final-modal";

// 4. Variables
const dateRange = ref({
  start_date: $moment().startOf("month").subtract(7, "days").format("YYYY-MM-DD"),
  end_date: $moment().endOf("month").add(7, "days").format("YYYY-MM-DD"),
});

// 5. Computed & Custom Hooks
const selectedTeamId = computed(() => teamsStore.selectedTeamId!);
const { filteredData } = useFilter({
  data: events,
  key: "events-filter",
  filters: [/* ... */],
});

// 6. Server requests
const {
  data: events,
  refresh,
  pending,
} = await useAsyncData("events-full", async () => {
  return await eventsStore.getEvents({
    coach__in: authStore.user?.role.id,
    ...dateRange.value,
  });
});

// 7. App functions
const updatePeriod = (event: { start: string; end: string }) => {
  dateRange.value.start_date = $moment(event.start).format("YYYY-MM-DD");
  dateRange.value.end_date = $moment(event.end).format("YYYY-MM-DD");
  refresh();
};

// 8. Modals
const openCreateEventModal = () => {
  const { open, close } = useModal({
    component: CreateEventModal,
    attrs: {
      mode: "event",
      onClose() { close(); },
    },
  });
  open();
};

// 9. Watchers
watch(route, () => {
  if (route.query.mode === "addEvent") {
    openCreateEventModal();
  }
}, { immediate: true });

// 10. App lifecycle
onActivated(() => {
  refresh();
});

definePageMeta({
  middleware: ["auth", "route"],
  auth: true,
  route: "Calendar",
});
</script>
```

#### Настройка

Вы можете настроить порядок групп и их паттерны:

```javascript
{
  "vue-code-order/vue-script-setup-order": ["error", {
    "order": [
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
    ],
    "groups": {
      "custom-group": {
        "patterns": ["customPattern.*"],
        "description": "Custom group description"
      }
    }
  }]
}
```

## Совместимость

- ESLint: >= 8.0.0
- Vue: >= 3.0.0
- Node.js: >= 16.0.0

## Лицензия

MIT
