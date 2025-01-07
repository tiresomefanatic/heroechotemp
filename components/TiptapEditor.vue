<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";
import { useGithub } from "~/composables/useGithub";
import { useToast } from "~/composables/useToast";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Define comprehensive interfaces for our component
interface Props {
  content: string;
  filePath: string;
  branch?: string;
  autosaveInterval?: number;
  previewEnabled?: boolean;
}

interface VersionEntry {
  timestamp: Date;
  content: string;
  description?: string;
}

interface Emits {
  (event: "update:content", content: string): void;
  (event: "save", content: string): void;
  (event: "error", error: Error): void;
  (event: "upload:start"): void;
  (event: "upload:complete", url: string): void;
  (event: "upload:error", error: Error): void;
}

// Set default props
const props = withDefaults(defineProps<Props>(), {
  autosaveInterval: 30000,
  previewEnabled: true,
});

const emit = defineEmits<Emits>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  if (target) {
    emit("update:content", target.value);
  }
};

// Initialize state management
const localContent = ref(props.content);
const originalContent = ref(props.content);
const isSaving = ref(false);
const isUploading = ref(false);
const currentBranch = ref(props.branch || "");
const previewMode = ref(false);
const versionHistory = ref<VersionEntry[]>([]);
const lastSavedVersion = ref<string | null>(null);

// Initialize composables
const { showToast } = useToast();
const { saveFile, getFileContent, isLoggedIn, login } = useGithub();

// Computed properties
const hasChanges = computed(() => localContent.value !== originalContent.value);

const previewContent = ref('');

// Update preview content when local content changes
watch(localContent, async (newContent) => {
  const rawHtml = await marked(newContent);
  previewContent.value = DOMPurify.sanitize(rawHtml);
});

const canRevert = computed(() => versionHistory.value.length > 0);

// Content loading function
const loadContent = async () => {
  if (!props.filePath) {
    showToast({
      title: "Error",
      message: "No file path provided",
      type: "error",
    });
    return;
  }

  try {
    const content = await getFileContent(
      "tiresomefanatic",
      "heroechotemp",
      props.filePath,
      props.branch
    );

    if (content) {
      localContent.value = content;
      originalContent.value = content;
      lastSavedVersion.value = content;

      versionHistory.value.push({
        timestamp: new Date(),
        content: content,
        description: "Initial version",
      });
    } else {
      showToast({
        title: "Warning",
        message: "No content found for this file",
        type: "warning",
      });
    }
  } catch (error) {
    console.error("Error loading content:", error);
    showToast({
      title: "Error",
      message: "Failed to load content. Please try again.",
      type: "error",
    });
    emit("error", error as Error);
  }
};

// Save content function
const saveToDisk = async () => {
  if (!hasChanges.value || isSaving.value) {
    return;
  }

  if (!props.filePath) {
    showToast({
      title: "Error",
      message: "No file path provided",
      type: "error",
    });
    return;
  }

  isSaving.value = true;

  try {
    const branchName = currentBranch.value || generateBranchName();

    const result = await saveFile(
      "tiresomefanatic",
      "heroechotemp",
      props.filePath,
      localContent.value,
      `Update ${props.filePath}`,
      branchName
    );

    if (result) {
      currentBranch.value = branchName;
      originalContent.value = localContent.value;
      lastSavedVersion.value = localContent.value;

      versionHistory.value.push({
        timestamp: new Date(),
        content: localContent.value,
        description: "Manual save",
      });

      if (versionHistory.value.length > 10) {
        versionHistory.value.shift();
      }

      showToast({
        title: "Success",
        message: "Content saved successfully",
        type: "success",
      });

      emit("save", localContent.value);
    } else {
      throw new Error("Failed to save content");
    }
  } catch (error) {
    console.error("Error saving content:", error);
    showToast({
      title: "Error",
      message: "Failed to save content. Please try again.",
      type: "error",
    });
    emit("error", error as Error);
  } finally {
    isSaving.value = false;
  }
};

// Autosave functionality
let autoSaveTimeout: NodeJS.Timeout;
const setupAutoSave = () => {
  clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(async () => {
    if (hasChanges.value) {
      versionHistory.value.push({
        timestamp: new Date(),
        content: localContent.value,
        description: "Auto-saved version",
      });

      if (versionHistory.value.length > 10) {
        versionHistory.value.shift();
      }

      await saveToDisk();
    }
  }, props.autosaveInterval);
};

// Generate unique branch name
const generateBranchName = () => {
  const timestamp = new Date().getTime();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const fileName = props.filePath.split("/").pop();
  return `update-${fileName}-${timestamp}-${randomStr}`;
};

// Handle markdown shortcuts
const handleKeyboard = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    saveToDisk();
  }

  if ((e.ctrlKey || e.metaKey) && e.key === "p") {
    e.preventDefault();
    previewMode.value = !previewMode.value;
  }
};

// Version control
const revertToVersion = (index: number) => {
  const version = versionHistory.value[index];
  if (version) {
    localContent.value = version.content;
    showToast({
      title: "Success",
      message: "Reverted to previous version",
      type: "success",
    });
  }
};

// Watch for content changes
watch(
  () => localContent.value,
  () => {
    setupAutoSave();
    emit("update:content", localContent.value);
  }
);

// Lifecycle hooks
onMounted(async () => {
  window.addEventListener("keydown", handleKeyboard);
  await loadContent();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyboard);
  clearTimeout(autoSaveTimeout);
});
</script>

<template>
  <div class="editor-wrapper">
    <!-- Login prompt -->
    <div v-if="!isLoggedIn" class="login-prompt">
      <p class="login-message">Please sign in with GitHub to edit this file</p>
      <button @click="login" class="login-button">
        <svg class="github-icon" viewBox="0 0 24 24" width="16" height="16">
          <path
            fill="currentColor"
            d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
          />
        </svg>
        Sign in with GitHub
      </button>
    </div>

    <!-- Editor toolbar -->
    <div v-else class="editor-toolbar">
      <div class="toolbar-left">
        <span class="file-path">{{ filePath }}</span>
        <span v-if="currentBranch" class="branch-name">
          <svg class="branch-icon" viewBox="0 0 16 16" width="16" height="16">
            <path
              fill="currentColor"
              d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0Z"
            />
          </svg>
          {{ currentBranch }}
        </span>
      </div>

      <div class="toolbar-right">
        <button
          v-if="previewEnabled"
          class="toolbar-button"
          :class="{ active: previewMode }"
          @click="previewMode = !previewMode"
        >
          {{ previewMode ? "Edit" : "Preview" }}
        </button>

        <button
          class="toolbar-button"
          :class="{ loading: isSaving }"
          :disabled="isSaving || !hasChanges"
          @click="saveToDisk"
        >
          <span v-if="isSaving">Saving...</span>
          <span v-else>{{ hasChanges ? "Save Changes" : "Saved" }}</span>
        </button>

        <div class="version-dropdown" v-if="canRevert">
          <button class="toolbar-button">History</button>
          <div class="version-list">
            <button
              v-for="(version, index) in versionHistory"
              :key="index"
              class="version-item"
              @click="revertToVersion(index)"
            >
              {{ new Date(version.timestamp).toLocaleTimeString() }}
              <span class="version-description">{{ version.description }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Editor content -->
    <div class="editor-content">
      <textarea
        v-if="!previewMode"
        v-model="localContent"
        class="markdown-editor"
        :class="{ 'has-changes': hasChanges }"
        @input="handleInput"
        placeholder="Start writing..."
        :disabled="!isLoggedIn || isSaving"
        aria-label="Markdown editor"
      ></textarea>

      <div v-else class="markdown-preview" v-html="previewContent"></div>
    </div>

    <!-- Unsaved changes warning -->
    <div v-if="hasChanges" class="unsaved-warning" role="alert">
      You have unsaved changes. Press Ctrl/Cmd + S to save.
    </div>
  </div>
</template>

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
  font-family: "Monaco", monospace;
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
  content: "";
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
  font-family: "Monaco", "Menlo", "Ubuntu Mono", "Consolas", "source-code-pro",
    monospace;
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
