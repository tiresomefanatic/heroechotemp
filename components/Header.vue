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
            Logout
          </button>
        </div>
        <button v-else-if="!isAuthenticated" @click="handleLogin" class="login-button">
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
import { useRoute } from '#app'
import { useGithubAuth } from '~/composables/useGithubAuth'

interface GitHubUser {
  login: string
  avatar_url: string
  name?: string
}

const { isAuthenticated, accessToken, loading } = useGithubAuth()
const user = ref<GitHubUser | null>(null)
const route = useRoute()

const fetchUserData = async () => {
  if (!accessToken.value) return
  
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    if (response.ok) {
      user.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

onMounted(() => {
  if (isAuthenticated.value) {
    fetchUserData()
  }
})

watch(isAuthenticated, (newValue) => {
  if (newValue) {
    fetchUserData()
  } else {
    user.value = null
  }
})

const handleLogin = () => {
  window.location.href = `/api/auth/github`
}

const handleLogout = () => {
  localStorage.removeItem('github_access_token')
  window.location.reload()
}
</script>

<style scoped>
.header {
  @apply fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700;
}

.header-content {
  @apply container mx-auto px-4 h-16 flex items-center justify-between;
}

.logo {
  @apply flex items-center space-x-2;
}

.logo-link {
  @apply text-xl font-bold text-gray-900 dark:text-white;
}

.logo-dot {
  @apply w-2 h-2 bg-blue-500 rounded-full;
}

.nav {
  @apply hidden md:flex space-x-4;
}

.nav-link {
  @apply text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium;
}

.nav-link.active {
  @apply text-blue-600 dark:text-blue-400;
}

.header-right {
  @apply flex items-center space-x-4;
}

.search {
  @apply hidden md:block;
}

.search-input {
  @apply bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.loading-indicator {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.user-name {
  color: #fff;
  font-size: 14px;
}

.logout-button {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.login-button, .logout-button {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}

.github-icon {
  @apply mr-2;
}
</style>
