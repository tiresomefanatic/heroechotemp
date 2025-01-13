<!-- components/Header.vue -->
<template>
  <header class="header">
    <div class="header-content">
      <!-- Logo Section -->
      <div class="logo">
        <NuxtLink to="/" class="logo-link">ECHO</NuxtLink>
        <span class="logo-dot"></span>
      </div>

      <!-- Navigation -->
      <nav class="nav">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.disabled ? '' : item.path"
          class="nav-link"
          :class="{
            active: $route.path.startsWith(item.path),
            disabled: item.disabled,
          }"
          @click.prevent="!item.disabled && navigateTo(item.path)"
        >
          {{ item.label }}
          <span v-if="item.disabled" class="lock-icon">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </NuxtLink>
      </nav>

      <!-- Right Section -->
      <div class="header-right">
        <!-- Search -->
        <div class="search">
          <input
            type="text"
            placeholder="Search"
            class="search-input"
            disabled
          />
          <span class="search-divider">/</span>
        </div>

        <!-- Authentication Area -->
        <div v-if="loading" class="loading-indicator">Loading...</div>
        <div v-else-if="isAuthenticated && user" class="user-profile">
          <div class="user-info">
            <img :src="user.avatar_url" :alt="user.login" class="user-avatar" />
            <span class="user-name">{{ user.login }}</span>
          </div>
          <button @click="handleLogout" class="logout-button">Logout</button>
        </div>
        <button v-else @click="handleLogin" class="login-button">
          <svg class="github-icon" viewBox="0 0 24 24" width="16" height="16">
            <path
              fill="currentColor"
              d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
          Sign in with GitHub
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, navigateTo } from "#app";
import { useGithubAuth } from "~/composables/useGithubAuth";

interface GitHubUser {
  login: string;
  avatar_url: string;
  name?: string;
}

interface NavItem {
  label: string;
  path: string;
  disabled: boolean;
}

const navItems: NavItem[] = [
  { label: "Design", path: "/design", disabled: false },
  { label: "Develop", path: "/develop", disabled: true },
  { label: "Contribute", path: "/contribute", disabled: true },
  { label: "Options", path: "/options", disabled: true },
];

const {
  isAuthenticated,
  accessToken,
  loading,
  initiateLogin,
  logout: authLogout,
} = useGithubAuth();

const user = ref<GitHubUser | null>(null);
const route = useRoute();

const fetchUserData = async () => {
  if (!accessToken.value) return;

  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });
    if (response.ok) {
      user.value = await response.json();
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

onMounted(() => {
  if (isAuthenticated.value) {
    fetchUserData();
  }
});

watch(isAuthenticated, (newValue) => {
  if (newValue) {
    fetchUserData();
  } else {
    user.value = null;
  }
});

const handleLogin = async () => {
  try {
    await initiateLogin();
  } catch (error) {
    console.error("Login error:", error);
  }
};

const handleLogout = () => {
  authLogout();
  user.value = null;
};
</script>

<style scoped>
.header {
  @apply fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200;
}

.header-content {
  @apply container mx-auto px-8 h-16 flex items-center justify-between;
}

.logo {
  @apply flex items-center space-x-2;
}

.logo-link {
  @apply text-xl font-bold text-gray-900;
}

.logo-dot {
  @apply w-2 h-2 bg-orange-500 rounded-full;
}

.nav {
  @apply flex-1 flex justify-center space-x-8;
}

.nav-link {
  @apply text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2;
}

.nav-link.active {
  @apply text-gray-900;
}

.nav-link.disabled {
  @apply cursor-not-allowed opacity-50 hover:text-gray-600;
}

.lock-icon {
  @apply inline-flex items-center;
}

.header-right {
  @apply flex items-center space-x-4;
}

.search {
  @apply relative flex items-center;
}

.search-input {
  @apply w-64 pl-4 pr-8 py-2 bg-transparent border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.search-divider {
  @apply absolute right-3 text-gray-400;
}

.loading-indicator {
  @apply text-sm text-gray-500;
}

.user-profile {
  @apply flex items-center space-x-4;
}

.user-info {
  @apply flex items-center space-x-2;
}

.user-avatar {
  @apply w-8 h-8 rounded-full;
}

.user-name {
  @apply text-sm text-gray-900;
}

.login-button,
.logout-button {
  @apply inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}

.github-icon {
  @apply mr-2;
}

@media (max-width: 768px) {
  .nav {
    @apply hidden;
  }

  .search {
    @apply hidden;
  }

  .header-content {
    @apply px-4;
  }
}
</style>
