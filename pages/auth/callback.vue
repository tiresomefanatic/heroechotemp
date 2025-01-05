<template>
  <div class="flex min-h-screen items-center justify-center">
    <UCard>
      <template #header>
        <h3 class="text-xl font-semibold">Authenticating...</h3>
      </template>
      <p v-if="error" class="text-red-500">{{ error }}</p>
      <p v-else>Please wait while we complete your authentication...</p>
    </UCard>
  </div>
</template>

<script setup>
const route = useRoute();
const error = ref(null);

onMounted(async () => {
  try {
    const code = route.query.code;
    if (!code) {
      error.value = "No authorization code provided";
      return;
    }

    // Exchange code for token directly with GitHub
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: "4c1c42d1d9d1a5c0c887",
        client_secret: "9e7428c3f26bb11c7cd8b0f3c7c8e2a7e3f3b3f3",
        code: code,
      }),
    });

    const data = await response.json();
    console.log("Auth response:", data);

    if (data.error) {
      error.value = data.error_description || "Authentication failed";
      return;
    }

    if (data.access_token) {
      localStorage.setItem("github_token", data.access_token);
      navigateTo("/", { replace: true });
    } else {
      error.value = "No access token received";
    }
  } catch (err) {
    console.error("Authentication error:", err);
    error.value = "Failed to authenticate with GitHub";
  }
});
</script>
