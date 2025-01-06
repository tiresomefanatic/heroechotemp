<template>
  <div class="flex min-h-screen items-center justify-center">
    <UCard>
      <template #header>
        <h3 class="text-xl font-semibold">Authenticating...</h3>
      </template>
      <p v-if="error" class="text-red-500">{{ error }}</p>
      <p v-else>Please wait while we complete your authentication...</p>
      <p class="text-sm text-gray-500">Debug info: {{ debugInfo }}</p>
    </UCard>
  </div>
</template>

<script setup>
const route = useRoute();
const error = ref(null);
const debugInfo = ref('');

onMounted(() => {
  try {
    // Get token from URL fragment
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    
    // Log debug info
    debugInfo.value = `Hash: ${hash}, Params: ${JSON.stringify(Object.fromEntries(params.entries()))}`;

    if (accessToken) {
      localStorage.setItem("github_token", accessToken);
      navigateTo("/", { replace: true });
    } else {
      error.value = "No access token received";
    }
  } catch (err) {
    console.error("Authentication error:", err);
    error.value = "Failed to authenticate with GitHub";
    debugInfo.value = `Error: ${err.message}`;
  }
});
</script>
