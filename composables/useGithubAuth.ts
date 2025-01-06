import { ref } from 'vue'

export const useGithubAuth = () => {
  const isAuthenticated = ref(false)
  const accessToken = ref<string | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  const initiateLogin = () => {
    if (!process.client) return

    const clientId = useRuntimeConfig().public.githubClientId
    if (!clientId) {
      error.value = 'GitHub client ID is not configured'
      return
    }

    const redirectUri = `${window.location.origin}/auth/callback`
    const scope = 'read:user user:email'
    const state = Math.random().toString(36).substring(7)

    // Store state in localStorage to prevent CSRF attacks
    localStorage.setItem('github_oauth_state', state)

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`
    window.location.href = authUrl
  }

  const handleCallback = async (code: string, state: string) => {
    if (!process.client) return

    const savedState = localStorage.getItem('github_oauth_state')
    localStorage.removeItem('github_oauth_state')

    if (state !== savedState) {
      error.value = 'Invalid state parameter'
      return
    }

    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const response = await $fetch(`${config.public.siteUrl}/api/auth/token`, {
        method: 'POST',
        body: { code }
      })

      if ('access_token' in response) {
        accessToken.value = response.access_token
        isAuthenticated.value = true
        
        // Store token securely
        localStorage.setItem('github_access_token', response.access_token)
      } else {
        throw new Error('Invalid response from token endpoint')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to exchange code for token'
      isAuthenticated.value = false
      accessToken.value = null
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    if (!process.client) return
    
    accessToken.value = null
    isAuthenticated.value = false
    localStorage.removeItem('github_access_token')
  }

  // Check for existing token on init
  const initialize = () => {
    if (!process.client) return
    
    const token = localStorage.getItem('github_access_token')
    if (token) {
      accessToken.value = token
      isAuthenticated.value = true
    }
  }

  // Initialize on composable creation
  initialize()

  return {
    isAuthenticated,
    accessToken,
    error,
    loading,
    initiateLogin,
    handleCallback,
    logout,
    initialize
  }
}
