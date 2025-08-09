<template>
  <div class="root">
    <CalendarLeftMenu :events="events || []" />

    <div class="content is-light-mode">
      <div class="actions">
        <DropButton :options="buttonOptions">
          <template #select>
            <div class="add-select"><Icon name="w-icons:add" />Добавить</div>
          </template>
        </DropButton>
      </div>

      <Qalendar
        :events="filteredData || []"
        :is-loading="pending"
        :config="config"
        @updated-period="updatePeriod"
      >
        <template #dayCell="{ dayData }">
          <DayOfMonth :day-data="dayData" :events="dayData.events" />
        </template>

        <template #eventDialog="props">
          {{ props }}
        </template>

        <template #weekDayEvent="eventProps">
          <CalendarEvent :event-data="eventProps.eventData" />
        </template>

        <template #monthEvent="eventProps">
          <CalendarEvent :event-data="eventProps.eventData" />
        </template>
      </Qalendar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Qalendar } from "qalendar";
import { useModal } from "vue-final-modal";
import DropButton from "~/shared/ui/DropButton/DropButton.vue";
import { useAuthStore } from "~/store/auth/authStore";
import { useEventsStore } from "~/store/events/eventsStore";
import { useTeamsStore } from "~/store/teams/teamsStore";
import DayOfMonth from "~/components/pages/Calendar/DayOfMonth/DayOfMonth.vue";
import CalendarEvent from "~/components/pages/Calendar/CalendarEvent/CalendarEvent.vue";
import CreateEventModal from "~/components/modals/CreateEvent/CreateEventModal.vue";
import CalendarLeftMenu from "~/components/layout/LeftMenu/Calendar/CalendarLeftMenu.vue";
import type { IEvent } from "~/models/events";

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

const selectedTeamId = computed(() => teamsStore.selectedTeamId!);

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

const openCreatePlanModal = () => {
  const { open, close } = useModal({
    component: CreateEventModal,
    attrs: {
      mode: "plan",
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

const buttonOptions = [
  {
    title: "Добавить событие",
    icon: "add-event",
    handler: () => {
      openCreateEventModal();
    },
  },
  {
    title: "Добавить план",
    icon: "add-plan",
    handler: () => {
      openCreatePlanModal();
    },
  },
  { title: "Повтор события", icon: "repeat-event", handler: () => {} },
];

const {
  data: events,
  refresh,
  pending,
} = await useAsyncData(
  "events-full",
  async () => {
    const res = await eventsStore.getEvents<IEvent[]>({
      coach__in: authStore.user?.role.id,
      ...dateRange.value,
    });

    return res;
  },
  {
    watch: [selectedTeamId],
  }
);

const { filteredData } = useFilter({
  data: events,
  key: "events-filter",
  filters: [
    {
      field: "eventType",
      type: "select",
    },
    {
      field: "goal",
      type: "custom",
      customFilter: (event, value) => {
        return !!event.planOnPeriod.goals.find(
          (evGoal) => !!value.find((goal: number) => goal === evGoal.id)
        );
      },
    },
  ],
});

const updatePeriod = (event: { start: string; end: string }) => {
  dateRange.value.start_date = $moment(event.start).format("YYYY-MM-DD");
  dateRange.value.end_date = $moment(event.end).format("YYYY-MM-DD");

  refresh();
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

<style scoped lang="scss">
@import url("~/assets/styles/pages/calendar.scss");
</style>
