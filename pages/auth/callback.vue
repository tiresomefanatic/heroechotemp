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
const debugInfo = ref("");

onMounted(async () => {
  try {
    // Get authorization code from URL query parameters
    const code = route.query.code;
    debugInfo.value = `Code: ${code}`;

    if (code) {
      // Exchange the code for an access token using our API route
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to exchange code for token');
      }

      const data = await response.json();
      localStorage.setItem("github_token", data.access_token);
      navigateTo("/", { replace: true });
    } else {
      error.value = "No authorization code found in URL";
    }
  } catch (err) {
    console.error("Authentication error:", err);
    error.value = "Failed to authenticate with GitHub";
    debugInfo.value = `Error: ${err.message}`;
  }
});
</script>
