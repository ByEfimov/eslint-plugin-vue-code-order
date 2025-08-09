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
      filename: "real-test.vue",
      code: `
<template>
  <div class="root">
    <CalendarLeftMenu :events="events || []" />
  </div>
</template>

<script setup lang="ts">
import { Qalendar } from "qalendar";
import { useModal } from "vue-final-modal";

const { $moment } = useNuxtApp();
const route = useRoute();

const authStore = useAuthStore();
const eventsStore = useEventsStore();
const teamsStore = useTeamsStore();

const dateRange = ref({
  start_date: $moment()
    .startOf("month")
    .subtract(7, "days")
    .format("YYYY-MM-DD"),
  end_date: $moment().endOf("month").add(7, "days").format("YYYY-MM-DD"),
});

const config = {
  week: {},
  month: { showTrailingAndLeadingDates: true, showEventsOnMobileView: true },
  locale: "ru-RU",
  eventDialog: {
    isCustom: true,
  },
  style: {
    fontFamily: "Inter",
  },
  defaultMode: "month",
};

const selectedTeamId = computed(() => teamsStore.selectedTeamId!);

const {
  data: events,
  refresh,
  pending,
} = await useAsyncData(
  "events-full",
  async () => {
    const res = await eventsStore.getEvents({
      coach__in: authStore.user?.role.id,
      ...dateRange.value,
    });
    return res;
  },
  {
    watch: [selectedTeamId],
  }
);

const openCreateEventModal = () => {
  const { open, close } = useModal({
    component: CreateEventModal,
    attrs: {
      mode: "event",
      onClose() {
        close();
      },
      async onDoneCreate() {
        await refresh();
        close();
      },
    },
  });
  open();
};

watch(
  route,
  () => {
    if (route.query.mode === "addEvent") {
      openCreateEventModal();
    }
  },
  { immediate: true }
);

onActivated(() => {
  refresh();
});

definePageMeta({
  middleware: ["auth", "route"],
  auth: true,
  route: "Calendar",
});
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
// Неправильный порядок - stores перед framework init
const authStore = useAuthStore();
const route = useRoute();

const message = ref('Hello');
</script>
      `,
      errors: [
        {
          messageId: "incorrectOrder",
          data: {
            expectedGroup: "Store initialization",
            actualGroup: "Framework initialization functions",
          },
        },
      ],
    },

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
  ],
});

console.log("All tests passed!");
