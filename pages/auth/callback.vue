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

    // Exchange code for token directly with GitHub
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: config.public.githubClientId,
        code: code,
        // Note: client_secret is not included for security
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
    console.error('Authentication error:', err);
    error.value = 'Failed to authenticate with GitHub';
  }
});
</script>
