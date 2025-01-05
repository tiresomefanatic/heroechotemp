<template>
  <div class="editor-wrapper">
    <CollaborationSidebar v-if="isLoggedIn" />
    <div class="editor-toolbar" v-if="isLoggedIn">
      <div class="toolbar-left">
        <span class="file-path">{{ filePath }}</span>
        <span v-if="currentBranch" class="branch-name">
          <svg class="branch-icon" viewBox="0 0 16 16" width="16" height="16">
            <path fill="currentColor" d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
          </svg>
          {{ currentBranch }}
        </span>
      </div>
      <div class="toolbar-right">
        <button 
          class="toolbar-button" 
          :class="{ loading: isSaving }"
          :disabled="isSaving || !hasChanges"
          @click="saveChanges"
        >
          <span v-if="!isSaving">Save Changes</span>
          <span v-else>Saving...</span>
        </button>
        <button 
          v-if="hasChanges"
          class="toolbar-button create-pr"
          :disabled="isSaving"
          @click="createPR"
        >
          Create PR
        </button>
      </div>
    </div>
    <div v-else class="login-prompt">
      <p>Please sign in with GitHub to edit this file</p>
      <button class="login-button" @click="login">
        <svg class="github-icon" viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        Sign in with GitHub
      </button>
    </div>
    <textarea
      v-model="localContent"
      class="markdown-editor"
      @input="handleInput"
      placeholder="Start writing..."
      :disabled="!isLoggedIn || isSaving"
    ></textarea>
    
    <!-- Image Upload Modal -->
    <div v-if="showImageUpload" class="modal-overlay">
      <div class="modal">
        <h3>Upload Image</h3>
        <div class="upload-area" @drop.prevent="handleDrop" @dragover.prevent>
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileSelect" 
            accept="image/*" 
            class="file-input"
          />
          <p>Drag and drop an image or click to select</p>
        </div>
        <div class="modal-actions">
          <button @click="showImageUpload = false" class="cancel-button">Cancel</button>
          <button 
            @click="uploadImage" 
            :disabled="!selectedFile || isUploading" 
            class="upload-button"
          >
            {{ isUploading ? 'Uploading...' : 'Upload' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useGithub } from '~/composables/useGithub'
import { useToast } from '~/composables/useToast'
import CollaborationSidebar from '~/components/CollaborationSidebar.vue'

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  [key: string]: any;
}

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  filePath: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:content', 'save'])

// State
const localContent = ref(props.content)
const originalContent = ref(props.content)
const isSaving = ref(false)
const currentBranch = ref('')
const showImageUpload = ref(false)
const selectedFile = ref<File | null>(null)
const isUploading = ref(false)
const user = ref<GitHubUser | null>(null)

// Composables
const { 
  getUser, 
  login, 
  createFork, 
  createBranch, 
  saveFile,
  createPullRequest,
  getFileContent 
} = useGithub()
const { showToast } = useToast()

// Computed
const isLoggedIn = computed(() => !!user.value)
const hasChanges = computed(() => localContent.value !== originalContent.value)

// Methods
const handleInput = () => {
  emit('update:content', localContent.value)
}

const generateBranchName = () => {
  const timestamp = new Date().getTime()
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `update-${props.filePath.split('/').pop()}-${timestamp}-${randomStr}`
}

const saveChanges = async () => {
  if (!hasChanges.value || isSaving.value) return

  isSaving.value = true
  try {
    // Create fork if needed
    await createFork()
    
    // Create new branch
    const branchName = generateBranchName()
    await createBranch(branchName)
    currentBranch.value = branchName
    
    // Save file
    await saveFile(props.filePath, localContent.value, `Update ${props.filePath}`)
    originalContent.value = localContent.value
    
    showToast('Changes saved successfully!', 'success')
  } catch (error) {
    console.error('Error saving changes:', error)
    showToast('Failed to save changes. Please try again.', 'error')
  } finally {
    isSaving.value = false
  }
}

const createPR = async () => {
  if (!currentBranch.value) return
  
  try {
    const title = `Update ${props.filePath}`
    const body = `This PR updates the content of \`${props.filePath}\`.

Changes made:
${localContent.value !== originalContent.value ? '- Content updated' : ''}`

    await createPullRequest(currentBranch.value, title, body)
    showToast('Pull request created successfully!', 'success')
  } catch (error) {
    console.error('Error creating PR:', error)
    showToast('Failed to create pull request. Please try again.', 'error')
  }
}

// Image upload handlers
const handleDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    selectedFile.value = file
  }
}

const handleFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    selectedFile.value = file
  }
}

const uploadImage = async () => {
  if (!selectedFile.value) return
  
  isUploading.value = true
  try {
    const timestamp = new Date().getTime()
    const fileName = `${timestamp}-${selectedFile.value.name}`
    const path = `images/${fileName}`
    
    // Upload image to repository
    const imageUrl = await saveFile(
      path,
      await selectedFile.value.arrayBuffer(),
      `Upload image ${fileName}`
    )
    
    // Insert image markdown at cursor position
    const imageMarkdown = `![${fileName}](${imageUrl})`
    const textarea = document.querySelector('.markdown-editor') as HTMLTextAreaElement
    const cursorPos = textarea.selectionStart
    localContent.value = 
      localContent.value.slice(0, cursorPos) + 
      imageMarkdown + 
      localContent.value.slice(cursorPos)
    
    showImageUpload.value = false
    showToast('Image uploaded successfully!', 'success')
  } catch (error) {
    console.error('Error uploading image:', error)
    showToast('Failed to upload image. Please try again.', 'error')
  } finally {
    isUploading.value = false
    selectedFile.value = null
  }
}

// Keyboard shortcuts
const handleKeyboard = (e: KeyboardEvent) => {
  // Save: Ctrl/Cmd + S
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    saveChanges()
  }
  
  // Image upload: Ctrl/Cmd + Shift + I
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
    e.preventDefault()
    showImageUpload.value = true
  }
}

// Lifecycle
onMounted(async () => {
  window.addEventListener('keydown', handleKeyboard)
  const userData = await getUser()
  if (userData) {
    user.value = userData
  }
  
  // Load initial content
  try {
    const content = await getFileContent(props.filePath)
    localContent.value = content
    originalContent.value = content
  } catch (error) {
    console.error('Error loading content:', error)
    showToast('Failed to load content. Please try again.', 'error')
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard)
})
</script>

<style scoped>
.editor-wrapper {
  height: calc(100vh - 64px);
  background: white;
  display: flex;
  flex-direction: column;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.file-path {
  font-family: 'Monaco', monospace;
}

.branch-name {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: #eee;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.toolbar-right {
  display: flex;
  gap: 0.5rem;
}

.toolbar-button {
  padding: 0.5rem 1rem;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  background: white;
  color: #333;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-button:hover:not(:disabled) {
  border-color: var(--echo-orange);
  color: var(--echo-orange);
}

.toolbar-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-button.loading {
  position: relative;
  color: transparent;
}

.toolbar-button.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1rem;
  height: 1rem;
  margin: -0.5rem;
  border: 2px solid var(--echo-orange);
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.create-pr {
  background: var(--echo-orange);
  color: white;
  border-color: var(--echo-orange);
}

.create-pr:hover:not(:disabled) {
  background: white;
  color: var(--echo-orange);
}

.login-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.login-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  background: white;
  color: #333;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.login-button:hover {
  border-color: var(--echo-orange);
  color: var(--echo-orange);
}

.markdown-editor {
  flex: 1;
  width: 100%;
  padding: 32px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  background: white;
  border: none;
  resize: none;
  outline: none;
}

.markdown-editor:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
}

.upload-area {
  margin: 1rem 0;
  padding: 2rem;
  border: 2px dashed #eee;
  border-radius: 0.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-area:hover {
  border-color: var(--echo-orange);
}

.file-input {
  display: none;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-button,
.upload-button {
  padding: 0.5rem 1rem;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-button {
  background: var(--echo-orange);
  color: white;
  border-color: var(--echo-orange);
}

.upload-button:hover:not(:disabled) {
  background: white;
  color: var(--echo-orange);
}

.upload-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
