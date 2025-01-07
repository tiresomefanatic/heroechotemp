// composables/useGithubAuth.ts
import { ref } from "vue";

// Define interface for the GitHub API response
interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

// Define interface for API error response
interface ApiError {
  message: string;
  statusCode: number;
}

export const useGithubAuth = () => {
  const isAuthenticated = ref(false);
  const accessToken = ref<string | null>(null);
  const error = ref<string | null>(null);
  const loading = ref(false);

  const config = useRuntimeConfig();

  const initialize = () => {
    if (!process.client) return;

    const token = localStorage.getItem("github_access_token");
    if (token) {
      accessToken.value = token;
      isAuthenticated.value = true;
    }
  };

  const initiateLogin = () => {
    if (!process.client) return;

    const clientId = config.public.githubClientId;
    if (!clientId) {
      error.value = "GitHub client ID is not configured";
      return;
    }

    const state = Math.random().toString(36).substring(7);
    localStorage.setItem("github_oauth_state", state);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${config.public.siteUrl}/auth/callback`,
      scope: "repo user",
      state,
      response_type: "code",
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  };

  const handleCallback = async (code: string, state: string) => {
    if (!process.client) return;

    const savedState = localStorage.getItem("github_oauth_state");
    localStorage.removeItem("github_oauth_state");

    if (state !== savedState) {
      error.value = "Invalid state parameter";
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      // Explicitly type the response
      const response = await $fetch<GitHubTokenResponse>("/api/auth/token", {
        method: "POST",
        body: { code },
      });

      // Now TypeScript knows response.access_token is a string
      if (response.access_token) {
        accessToken.value = response.access_token;
        localStorage.setItem("github_access_token", response.access_token);
        isAuthenticated.value = true;
      } else {
        throw new Error("Invalid response from token endpoint");
      }
    } catch (err) {
      // Type guard for error handling
      const apiError = err as ApiError;
      console.error("Authentication error:", apiError);
      error.value = apiError.message || "Failed to authenticate";
      isAuthenticated.value = false;
      accessToken.value = null;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    if (!process.client) return;

    accessToken.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("github_access_token");
  };

  initialize();

  return {
    isAuthenticated,
    accessToken,
    error,
    loading,
    initiateLogin,
    handleCallback,
    logout,
    initialize,
  };
};
