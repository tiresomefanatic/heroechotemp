<!-- components/Header.vue -->
<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <NuxtLink to="/" class="logo-link">ECHO</NuxtLink>
        <span class="logo-dot"></span>
      </div>
      <nav class="nav">
        <NuxtLink to="/design/foundation/introduction" class="nav-link" :class="{ active: $route.path.startsWith('/design') }">Design</NuxtLink>
        <NuxtLink v-if="isAuthenticated" to="/editor" class="nav-link" :class="{ active: $route.path.startsWith('/editor') }">Editor</NuxtLink>
      </nav>
      <div class="header-right">
        <div class="search">
          <input type="text" placeholder="Search" class="search-input" />
        </div>
        <div v-if="loading" class="loading-indicator">
          Loading...
        </div>
        <div v-else-if="isAuthenticated && user" class="user-profile">
          <div class="user-info">
            <img :src="user.avatar_url" :alt="user.login" class="user-avatar" />
            <span class="user-name">{{ user.login }}</span>
          </div>
          <button @click="handleLogout" class="logout-button">
            <span>Logout</span>
          </button>
        </div>
        <button v-else @click="initiateLogin" class="login-button">
          <svg class="github-icon" viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Sign in with GitHub
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, navigateTo } from '#app'
import { useGithubAuth } from '~/composables/useGithubAuth'

interface GitHubUser {
  login: string
  avatar_url: string
  name?: string
}

const user = ref<GitHubUser | null>(null)
const loading = ref(false)

const { isAuthenticated, accessToken, error, initiateLogin, handleCallback, logout } = useGithubAuth()

const fetchUserData = async () => {
  if (!accessToken.value) return

  loading.value = true
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }
    
    user.value = await response.json()
  } catch (err) {
    console.error('Error fetching user data:', err)
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  user.value = null
  logout()
}

// Watch for authentication changes
watch(accessToken, () => {
  if (accessToken.value) {
    fetchUserData()
  } else {
    user.value = null
  }
}, { immediate: true })

// Handle OAuth callback on mount
onMounted(() => {
  const route = useRoute()
  const code = route.query.code as string
  const state = route.query.state as string
  
  if (code && state) {
    handleCallback(code, state)
    // Clean up URL
    navigateTo('/', { replace: true })
  }
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  max-width: 80rem;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-link {
  font-weight: 700;
  font-size: 1.25rem;
  color: #111827;
  text-decoration: none;
}

.logo-dot {
  width: 4px;
  height: 4px;
  background-color: #3b82f6;
  border-radius: 50%;
  margin-left: 2px;
}

.nav {
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: #4b5563;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #111827;
  background-color: #f3f4f6;
}

.nav-link.active {
  color: #111827;
  background-color: #f3f4f6;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search {
  position: relative;
}

.search-input {
  width: 200px;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: #f9fafb;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: #ffffff;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
}

.user-name {
  font-weight: 500;
  color: #111827;
}

.login-button, .logout-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: #ffffff;
  color: #111827;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.login-button:hover, .logout-button:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.github-icon {
  color: currentColor;
}

.loading-indicator {
  color: #6b7280;
  font-size: 0.875rem;
}
</style>
