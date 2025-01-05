<template>
  <aside class="design-sidebar">
    <nav class="design-nav">
      <div class="nav-content">
        <NuxtLink
          to="/design/foundation/introduction"
          class="nav-item"
          :class="{ active: $route.path === '/design/foundation/introduction' }"
          >Overview</NuxtLink
        >

        <div class="nav-group">
          <div class="nav-group-header" @click="toggleSection('foundation')">
            Foundation
            <span class="arrow" :class="{ rotated: !isCollapsed.foundation }"
              >▼</span
            >
          </div>
          <div
            class="nav-group-content"
            :class="{ collapsed: isCollapsed.foundation }"
          >
            <NuxtLink
              to="/design/foundation/logo"
              class="nav-item"
              :class="{ active: $route.path === '/design/foundation/logo' }"
              >Logo</NuxtLink
            >
            <NuxtLink
              to="/design/foundation/color"
              class="nav-item"
              :class="{ active: $route.path === '/design/foundation/color' }"
              >Color</NuxtLink
            >
            <NuxtLink
              to="/design/foundation/typography"
              class="nav-item"
              :class="{
                active: $route.path === '/design/foundation/typography',
              }"
              >Typography</NuxtLink
            >
            <NuxtLink
              to="/design/foundation/icons"
              class="nav-item"
              :class="{ active: $route.path === '/design/foundation/icons' }"
              >Icons</NuxtLink
            >
            <NuxtLink
              to="/design/foundation/layout"
              class="nav-item"
              :class="{ active: $route.path === '/design/foundation/layout' }"
              >Layout</NuxtLink
            >
            <NuxtLink
              to="/design/foundation/imagery"
              class="nav-item"
              :class="{ active: $route.path === '/design/foundation/imagery' }"
              >Imagery</NuxtLink
            >
            <NuxtLink
              to="/design/foundation/animation"
              class="nav-item"
              :class="{
                active: $route.path === '/design/foundation/animation',
              }"
              >Animation</NuxtLink
            >
            <NuxtLink
              to="/design/foundation/applications"
              class="nav-item"
              :class="{
                active: $route.path === '/design/foundation/applications',
              }"
              >Applications</NuxtLink
            >
          </div>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from "vue";

const isCollapsed = ref({
  foundation: false,
});

function toggleSection(section) {
  isCollapsed.value[section] = !isCollapsed.value[section];
}
</script>

<style scoped>
.design-sidebar {
  height: 100%;
  overflow-y: auto;
}

.design-nav {
  height: 100%;
  padding: 1rem;
}

.nav-content {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: sticky;
  top: 1rem;
}

.nav-item {
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  color: #333;
  font-size: 1rem;
  font-weight: 400;
}

.nav-item:hover:not(.locked) {
  cursor: pointer;
}

.nav-item.active {
  background: #e5e5e5;
  border-radius: 8px;
  font-weight: 500;
}

.nav-item.locked {
  color: #999;
  cursor: not-allowed;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nav-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 400;
}

.nav-group-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 1rem;
  max-height: 500px;
  transition: max-height 0.3s ease-out;
  overflow: hidden;
}

.nav-group-content.collapsed {
  max-height: 0;
}

.arrow {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.arrow.rotated {
  transform: rotate(180deg);
}
</style>
