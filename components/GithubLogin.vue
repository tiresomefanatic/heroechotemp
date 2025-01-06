<template>
  <div class="flex flex-col items-center gap-4">
    <div v-if="error" class="text-red-500 mb-4">
      {{ error }}
    </div>

    <template v-if="!isAuthenticated">
      <UButton
        :loading="loading"
        @click="initiateLogin"
        icon="i-simple-icons-github"
        size="lg"
        color="black"
      >
        Login with GitHub
      </UButton>
    </template>

    <template v-else>
      <div class="text-green-600 mb-4">
        Successfully authenticated with GitHub!
      </div>
      <UButton @click="logout" color="gray" variant="soft"> Logout </UButton>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useGithubAuth } from "~/composables/useGithubAuth";

const route = useRoute();
const {
  isAuthenticated,
  error,
  loading,
  initiateLogin,
  handleCallback,
  logout,
} = useGithubAuth();

// Handle OAuth callback
onMounted(() => {
  const code = route.query.code as string;
  const state = route.query.state as string;

  if (code && state) {
    handleCallback(code, state);

    // Clean up URL
    navigateTo("/", { replace: true });
  }
});
</script>
