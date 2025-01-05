<template>
  <div class="collaboration-sidebar" :class="{ open }">
    <button class="toggle-button" @click="toggleSidebar">
      <svg class="icon" viewBox="0 0 24 24" width="24" height="24">
        <path v-if="!open" fill="currentColor" d="M21 15.75c0-.414-.336-.75-.75-.75H3.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 .75-.75ZM21 12c0-.414-.336-.75-.75-.75H3.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 .75-.75ZM3.75 9h16.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5Z"/>
        <path v-else fill="currentColor" d="M5.72 5.72a.75.75 0 0 1 1.06 0L12 10.94l5.22-5.22a.75.75 0 1 1 1.06 1.06L13.06 12l5.22 5.22a.75.75 0 1 1-1.06 1.06L12 13.06l-5.22 5.22a.75.75 0 0 1-1.06-1.06L10.94 12 5.72 6.78a.75.75 0 0 1 0-1.06Z"/>
      </svg>
    </button>

    <div class="sidebar-content">
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab-button"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <span v-if="tab.count" class="count">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Pull Requests Tab -->
      <div v-if="activeTab === 'prs'" class="tab-content">
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          Loading pull requests...
        </div>
        <div v-else-if="pullRequests.length === 0" class="empty-state">
          No open pull requests
        </div>
        <div v-else class="pr-list">
          <div 
            v-for="pr in pullRequests" 
            :key="pr.number"
            class="pr-item"
            :class="{ 'has-conflicts': pr.mergeable === false }"
          >
            <div class="pr-header">
              <span class="pr-number">#{{ pr.number }}</span>
              <span class="pr-title">{{ pr.title }}</span>
            </div>
            <div class="pr-meta">
              <span class="pr-author">
                <img :src="pr.user.avatar_url" :alt="pr.user.login" class="author-avatar">
                {{ pr.user.login }}
              </span>
              <span class="pr-status" :class="pr.mergeable_state">
                {{ getPRStatus(pr) }}
              </span>
            </div>
            <div class="pr-actions">
              <button 
                class="action-button view"
                @click="openPR(pr.html_url)"
              >
                View on GitHub
              </button>
              <button 
                v-if="pr.mergeable === false"
                class="action-button resolve"
                @click="resolveConflicts(pr)"
              >
                Resolve Conflicts
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'" class="tab-content">
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          Loading commit history...
        </div>
        <div v-else-if="commits.length === 0" class="empty-state">
          No commit history
        </div>
        <div v-else class="commit-list">
          <div 
            v-for="commit in commits" 
            :key="commit.sha"
            class="commit-item"
          >
            <div class="commit-header">
              <span class="commit-message">{{ commit.commit.message }}</span>
            </div>
            <div class="commit-meta">
              <span class="commit-author">
                <img 
                  :src="commit.author?.avatar_url" 
                  :alt="commit.commit.author.name"
                  class="author-avatar"
                >
                {{ commit.commit.author.name }}
              </span>
              <span class="commit-date">
                {{ formatDate(commit.commit.author.date) }}
              </span>
            </div>
            <div class="commit-actions">
              <button 
                class="action-button view"
                @click="viewCommitDiff(commit)"
              >
                View Changes
              </button>
              <button 
                class="action-button restore"
                @click="restoreVersion(commit)"
              >
                Restore Version
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Conflicts Tab -->
      <div v-if="activeTab === 'conflicts'" class="tab-content">
        <div v-if="currentConflict" class="conflict-resolver">
          <div class="conflict-header">
            <h3>Resolve Conflicts</h3>
            <p>Choose which changes to keep for {{ currentConflict.file }}</p>
          </div>
          <div class="conflict-diff">
            <div class="diff-header">
              <button 
                class="diff-button"
                :class="{ active: selectedVersion === 'current' }"
                @click="selectedVersion = 'current'"
              >
                Current Changes
              </button>
              <button 
                class="diff-button"
                :class="{ active: selectedVersion === 'incoming' }"
                @click="selectedVersion = 'incoming'"
              >
                Incoming Changes
              </button>
            </div>
            <div class="diff-content">
              <pre v-if="selectedVersion === 'current'" class="diff-view current">{{ currentConflict.current }}</pre>
              <pre v-else class="diff-view incoming">{{ currentConflict.incoming }}</pre>
            </div>
          </div>
          <div class="conflict-actions">
            <button 
              class="action-button cancel"
              @click="cancelConflictResolution"
            >
              Cancel
            </button>
            <button 
              class="action-button resolve"
              @click="resolveConflict"
            >
              Accept {{ selectedVersion === 'current' ? 'Current' : 'Incoming' }} Changes
            </button>
          </div>
        </div>
        <div v-else class="empty-state">
          No conflicts to resolve
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGithub } from '~/composables/useGithub'
import { useToast } from '~/composables/useToast'

// State
const open = ref(false)
const activeTab = ref('prs')
const loading = ref(false)
const pullRequests = ref<any[]>([])
const commits = ref<any[]>([])
const currentConflict = ref<any>(null)
const selectedVersion = ref('current')

// Composables
const { 
  getPullRequests, 
  getCommits,
  resolveConflict: resolveGitHubConflict
} = useGithub()
const { showToast } = useToast()

// Computed
const tabs = computed(() => [
  { id: 'prs', label: 'Pull Requests', count: pullRequests.value.length },
  { id: 'history', label: 'History', count: commits.value.length },
  { id: 'conflicts', label: 'Conflicts', count: pullRequests.value.filter(pr => pr.mergeable === false).length }
])

// Methods
const toggleSidebar = () => {
  open.value = !open.value
}

const getPRStatus = (pr: any) => {
  if (pr.mergeable === false) return 'Has Conflicts'
  if (pr.mergeable === true) return 'Ready to Merge'
  return 'Checking'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const openPR = (url: string) => {
  window.open(url, '_blank')
}

const resolveConflicts = (pr: any) => {
  currentConflict.value = {
    file: pr.files[0]?.filename,
    current: pr.files[0]?.patch,
    incoming: pr.files[0]?.patch,
    pr
  }
  activeTab.value = 'conflicts'
}

const resolveConflict = async () => {
  if (!currentConflict.value) return

  try {
    loading.value = true
    await resolveGitHubConflict(
      currentConflict.value.pr.number,
      currentConflict.value.file,
      selectedVersion.value === 'current' ? 'ours' : 'theirs'
    )
    showToast('Conflict resolved successfully!', 'success')
    currentConflict.value = null
    await loadPullRequests()
  } catch (error) {
    console.error('Error resolving conflict:', error)
    showToast('Failed to resolve conflict. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}

const cancelConflictResolution = () => {
  currentConflict.value = null
  selectedVersion.value = 'current'
}

const viewCommitDiff = async (commit: any) => {
  // TODO: Implement diff viewer
  console.log('View diff for commit:', commit.sha)
}

const restoreVersion = async (commit: any) => {
  // TODO: Implement version restore
  console.log('Restore to commit:', commit.sha)
}

const loadPullRequests = async () => {
  loading.value = true
  try {
    pullRequests.value = await getPullRequests()
  } catch (error) {
    console.error('Error loading pull requests:', error)
    showToast('Failed to load pull requests', 'error')
  } finally {
    loading.value = false
  }
}

const loadCommits = async () => {
  loading.value = true
  try {
    commits.value = await getCommits()
  } catch (error) {
    console.error('Error loading commits:', error)
    showToast('Failed to load commits', 'error')
  } finally {
    loading.value = false
  }
}

// Load data on mount
onMounted(async () => {
  await Promise.all([
    loadPullRequests(),
    loadCommits()
  ])
})
</script>

<style scoped>
.collaboration-sidebar {
  position: fixed;
  top: 64px;
  right: -400px;
  width: 400px;
  height: calc(100vh - 64px);
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 90;
  display: flex;
}

.collaboration-sidebar.open {
  right: 0;
}

.toggle-button {
  position: absolute;
  left: -40px;
  top: 1rem;
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid #eee;
  border-right: none;
  border-radius: 0.5rem 0 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.toggle-button:hover {
  color: var(--echo-orange);
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab-button {
  flex: 1;
  padding: 1rem;
  border: none;
  background: none;
  color: #666;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.tab-button.active {
  color: var(--echo-orange);
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--echo-orange);
}

.count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  margin-left: 0.5rem;
  background: #eee;
  border-radius: 10px;
  font-size: 0.75rem;
  color: #666;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #666;
}

.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #eee;
  border-right-color: var(--echo-orange);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.pr-list,
.commit-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pr-item,
.commit-item {
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  background: white;
}

.pr-item.has-conflicts {
  border-color: #fecaca;
  background: #fff5f5;
}

.pr-header,
.commit-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.pr-number {
  color: #666;
  font-size: 0.875rem;
}

.pr-title,
.commit-message {
  font-weight: 500;
  color: #333;
}

.pr-meta,
.commit-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.pr-author,
.commit-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.pr-status {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.pr-status.clean {
  background: #dcfce7;
  color: #166534;
}

.pr-status.unstable {
  background: #fef9c3;
  color: #854d0e;
}

.pr-status.dirty {
  background: #fecaca;
  color: #991b1b;
}

.pr-actions,
.commit-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #eee;
  border-radius: 0.25rem;
  background: white;
  color: #666;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  border-color: var(--echo-orange);
  color: var(--echo-orange);
}

.action-button.resolve {
  background: var(--echo-orange);
  color: white;
  border-color: var(--echo-orange);
}

.action-button.resolve:hover {
  background: white;
}

.conflict-resolver {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.conflict-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.conflict-diff {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.diff-header {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
}

.diff-button {
  padding: 0.5rem 1rem;
  border: 1px solid #eee;
  border-radius: 0.25rem;
  background: white;
  color: #666;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.diff-button.active {
  background: var(--echo-orange);
  color: white;
  border-color: var(--echo-orange);
}

.diff-content {
  flex: 1;
  overflow: auto;
  padding: 1rem;
}

.diff-view {
  margin: 0;
  font-family: 'Monaco', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

.diff-view.current {
  color: #059669;
}

.diff-view.incoming {
  color: #2563eb;
}

.conflict-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #eee;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
