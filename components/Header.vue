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
      </nav>
      <div class="header-right">
        <div class="search">
          <input type="text" placeholder="Search" class="search-input" />
        </div>
        <div v-if="loading" class="loading-indicator">
          Loading...
        </div>
        <div v-else-if="user" class="user-profile">
          <div class="user-info">
            <img :src="user.avatar_url" :alt="user.login" class="user-avatar" />
            <span class="user-name">{{ user.login }}</span>
          </div>
          <button @click="logout" class="logout-button">
            <span>Logout</span>
          </button>
        </div>
        <button v-else @click="login" class="login-button">
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
import { useGithub } from '~/composables/useGithub'
import type { GitHubUser } from '~/composables/useGithub'

const { login, logout, getUser, user, loading } = useGithub()

// Initialize user state on mount
onMounted(async () => {
  // Check for token in URL
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get('token');
  
  if (urlToken) {
    localStorage.setItem('github_token', urlToken);
    // Clean up URL
    const baseUrl = process.env.NODE_ENV === 'production' ? '/heroechotemp' : '';
    window.history.replaceState({}, document.title, `${baseUrl}/`);
  }

  // Try to get user if we have a token
  if (localStorage.getItem('github_token')) {
    try {
      await getUser()
    } catch (error) {
      console.error('Failed to get user:', error)
    }
  }
})
</script>

<style scoped>
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #111827;
}

.nav-link.active {
  color: #3b82f6;
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
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  width: 200px;
  font-size: 0.875rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.user-name {
  font-weight: 500;
  color: #111827;
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 0.375rem;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #e5e7eb;
}

.login-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #24292e;
  border: none;
  border-radius: 0.375rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #1a1e21;
}

.github-icon {
  flex-shrink: 0;
}

.loading-indicator {
  padding: 0.5rem 1rem;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
