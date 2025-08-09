<template>
  <div>
    <h1>{{ pageTitle }}</h1>
    <p>{{ userInfo.name }}</p>
    <button @click="handleSubmit">Submit</button>
    <button @click="openModal">Open Modal</button>
  </div>
</template>

<script setup lang="ts">
// Framework initialization
const route = useRoute();
const router = useRouter();

// Stores
const userStore = useUserStore();
const authStore = useAuthStore();

// Libraries
const { copy } = useClipboard();
const toast = useToast();

// Variables
const pageTitle = ref("Test Page");
const userInfo = reactive({
  name: "John Doe",
  email: "john@example.com",
});
const isLoading = ref(false);

// Computed & Custom Hooks
const fullUserInfo = computed(() => `${userInfo.name} (${userInfo.email})`);
const { filteredData } = useFilter(userInfo);

// Server Requests
const { data: users } = await useAsyncData("users", () => fetchUsers());
const { pending, data: posts } = useLazyFetch("/api/posts");

// App Functions
const handleSubmit = () => {
  isLoading.value = true;
  // Submit logic here
  toast.success("Submitted successfully!");
  isLoading.value = false;
};

const validateForm = (data: any) => {
  return data.name && data.email;
};

// Modals
const openModal = () => {
  const modal = useModal();
  modal.open();
};

const closeModal = () => {
  // Modal close logic
};

// Watchers & Listeners
watch(userInfo, (newValue) => {
  console.log("User info changed:", newValue);
});

watchEffect(() => {
  if (users.value) {
    console.log("Users loaded:", users.value.length);
  }
});

// App Lifecycle
onMounted(() => {
  console.log("Component mounted");
  initializeData();
});

onBeforeUnmount(() => {
  console.log("Component will unmount");
});

const initializeData = () => {
  // Initialize component data
};
</script>
