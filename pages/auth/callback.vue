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
const config = useRuntimeConfig();
const route = useRoute();
const error = ref(null);

onMounted(async () => {
  try {
    const code = route.query.code;
    if (!code) {
      error.value = 'No authorization code provided';
      return;
    }

    // Exchange code for token using our server endpoint
    const response = await fetch(config.app.baseURL + 'api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: code
      })
    });

    const data = await response.json();
    
    if (data.error) {
      error.value = data.error_description || 'Authentication failed';
      return;
    }

    if (data.access_token) {
      // Store token in localStorage
      localStorage.setItem('github_token', data.access_token);
      
      // Redirect back to home
      navigateTo('/', { replace: true });
    }
  } catch (err) {
    error.value = err.message;
    console.error('Auth error:', err);
  }
});
</script>
