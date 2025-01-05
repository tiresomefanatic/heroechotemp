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
      <div class="search">
        <input type="text" placeholder="Search" class="search-input" />
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  watch: {
    '$route.path': {
      immediate: true,
      handler(path) {
        if (path === '/design') {
          this.$router.push('/design/foundation/introduction')
        }
      }
    }
  }
}
</script>

<style scoped>
.header {
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  text-decoration: none;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #000;
}

.logo-dot {
  width: 6px;
  height: 6px;
  background-color: var(--echo-orange);
  border-radius: 50%;
  margin-top: -12px;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--echo-orange);
}

.nav-link.active {
  color: var(--echo-orange);
}

.search {
  position: relative;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  width: 200px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--echo-orange);
}

.search-input::placeholder {
  color: #999;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .nav {
    gap: 1rem;
  }

  .search-input {
    width: 100%;
  }
}
</style>
