<template>
  <div class="editor-container">
    <div class="editor-header">
      <h2 class="text-xl font-bold">Editor</h2>
      <div class="commit-history">
        <h3 class="text-lg">Recent Commits</h3>
        <div v-if="loading" class="loading">Loading commits...</div>
        <div v-else-if="commits.length" class="commits-list">
          <div v-for="commit in commits" :key="commit.sha" class="commit-item">
            <div class="commit-message">{{ commit.commit.message }}</div>
            <div class="commit-meta">
              <span class="commit-author">{{ commit.commit.author.name }}</span>
              <span class="commit-date">{{ new Date(commit.commit.author.date).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>
        <div v-else class="no-commits">No commits found</div>
      </div>
    </div>
    <div class="editor-content">
      <!-- Add your editor content here -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGithubAuth } from '~/composables/useGithubAuth'

const { accessToken } = useGithubAuth()
const commits = ref([])
const loading = ref(false)

const fetchCommits = async () => {
  if (!accessToken.value) return
  
  loading.value = true
  try {
    const response = await fetch('https://api.github.com/repos/tiresomefanatic/heroechotemp/commits', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    commits.value = await response.json()
  } catch (error) {
    console.error('Error fetching commits:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCommits()
})
</script>

<style scoped>
.editor-container {
  @apply p-4;
}

.editor-header {
  @apply mb-4;
}

.commit-history {
  @apply mt-4 bg-gray-50 p-4 rounded-lg;
}

.commits-list {
  @apply mt-2 space-y-2;
}

.commit-item {
  @apply p-2 bg-white rounded border border-gray-200;
}

.commit-message {
  @apply font-medium;
}

.commit-meta {
  @apply text-sm text-gray-600 mt-1;
}

.commit-author {
  @apply mr-2;
}

.loading, .no-commits {
  @apply text-gray-600 py-2;
}
</style>
