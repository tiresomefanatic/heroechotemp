<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useToast } from "~/composables/useToast";
import { useGithub } from "~/composables/useGithub";
import { Octokit } from "@octokit/rest";
import CollaborationSidebar from "~/components/CollaborationSidebar.vue";

interface VersionEntry {
  timestamp: Date;
  content: string;
  description: string;
}

interface Props {
  content?: string;
  filePath: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:content", value: string): void;
  (e: "save", value: string): void;
  (e: "error", error: Error): void;
}>();

// Initialize state management
const localContent = ref("");
const originalContent = ref("");
const isSaving = ref(false);
const previewMode = ref(false);
const versionHistory = ref<VersionEntry[]>([]);

// Initialize composables
const { showToast } = useToast();
const github = useGithub();
const { isLoggedIn } = github;

// Create Octokit instance with stored token
const getOctokit = () => {
  if (!process.client) return null;
  const token = localStorage.getItem("github_token");
  if (!token) return null;
  return new Octokit({ auth: token });
};

// Watch for content changes from parent
watch(
  () => props.content,
  (newContent) => {
    console.log("Content prop changed:", {
      newContent,
      current: localContent.value,
      original: originalContent.value,
    });
    if (newContent !== undefined && !localContent.value) {
      // Only update both values on initial load
      localContent.value = newContent;
      originalContent.value = newContent;
      versionHistory.value = [
        {
          timestamp: new Date(),
          content: newContent,
          description: "Initial version",
        },
      ];
    }
  },
  { immediate: true }
);

// Watch local content changes
watch(localContent, (newContent) => {
  console.log("Local content changed:", {
    newContent,
    original: originalContent.value,
    hasChanges: newContent !== originalContent.value,
  });
  emit("update:content", newContent);
});

// Computed properties
const hasChanges = computed(() => {
  const isDifferent = localContent.value !== originalContent.value;
  console.log("Change detection:", {
    local: localContent.value,
    original: originalContent.value,
    isDifferent,
    localLength: localContent.value.length,
    originalLength: originalContent.value.length,
  });
  return isDifferent;
});

const previewContent = computed(() => {
  if (!localContent.value) return "";
  const rawHtml = marked(localContent.value);
  return DOMPurify.sanitize(rawHtml);
});

// Save content function
const saveToDisk = async () => {
  if (!hasChanges.value || isSaving.value) return;

  isSaving.value = true;
  try {
    console.log("Attempting to save:", {
      filePath: props.filePath,
      contentLength: localContent.value.length,
      isLoggedIn: isLoggedIn.value,
    });

    if (!isLoggedIn.value) {
      throw new Error("Please log in to GitHub first");
    }

    // Emit save event and let parent handle the actual saving
    emit("save", localContent.value);

    // Update local state after successful emit
    originalContent.value = localContent.value;
    
    // Update version history
    versionHistory.value.push({
      timestamp: new Date(),
      content: localContent.value,
      description: `Update ${props.filePath}`,
    });

    if (versionHistory.value.length > 10) {
      versionHistory.value.shift();
    }
  } catch (error) {
    console.error("Save error:", error);
    showToast({
      title: "Error",
      message: error instanceof Error ? error.message : "Failed to commit changes. Please try again.",
      type: "error",
    });
    emit("error", error as Error);
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="editor-wrapper">
    <!-- Login prompt -->
    <div v-if="!isLoggedIn" class="login-prompt">
      <p class="login-message">Please sign in with GitHub to edit this file</p>
      <button @click="github.login" class="login-button">
        Sign in with GitHub
      </button>
    </div>

    <div v-else class="editor-layout">
      <!-- Editor content -->
      <div class="editor-main">
        <!-- Editor toolbar -->
        <div class="editor-toolbar">
          <div class="toolbar-left">
            <span class="file-path">{{ props.filePath }}</span>
          </div>

          <div class="toolbar-right">
            <button
              v-if="true"
              class="toolbar-button"
              :class="{ active: previewMode }"
              @click="previewMode = !previewMode"
            >
              {{ previewMode ? "Edit" : "Preview" }}
            </button>

            <button
              v-if="hasChanges && !isSaving && !previewMode"
              class="toolbar-button primary"
              @click="saveToDisk"
            >
              Commit Changes
            </button>

            <button v-if="isSaving" class="toolbar-button loading" disabled>
              Saving...
            </button>
          </div>
        </div>

        <!-- Editor content -->
        <div class="editor-content">
          <textarea
            v-if="!previewMode"
            v-model="localContent"
            class="markdown-editor"
            :class="{ 'has-changes': hasChanges }"
            placeholder="Start writing..."
            :disabled="!isLoggedIn || isSaving"
            aria-label="Markdown editor"
          ></textarea>

          <div
            v-else
            class="markdown-preview prose"
            v-html="previewContent"
          ></div>
        </div>
      </div>

      <CollaborationSidebar />
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

.editor-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.editor-content {
  flex: 1;
  overflow: hidden;
  position: relative;
  background: white;
  display: flex;
  flex-direction: column;
}

.markdown-editor {
  width: 100%;
  height: 100%;
  padding: 1rem;
  border: none;
  resize: none;
  font-family: "Monaco", monospace;
  font-size: 14px;
  line-height: 1.6;
  overflow-y: auto;
}

.markdown-preview {
  padding: 2rem;
  overflow-y: auto;
  background-color: white;
  height: 100%;
  width: 100%;
}

.prose {
  max-width: 65ch;
  margin: 0 auto;
}

.prose :deep(h1) {
  font-size: 2em;
  margin-bottom: 1em;
}

.prose :deep(h2) {
  font-size: 1.5em;
  margin: 1em 0;
}

.prose :deep(p) {
  margin: 1em 0;
  line-height: 1.6;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin: 1em 0;
  padding-left: 2em;
}

.prose :deep(code) {
  background: #f6f8fa;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: "Monaco", monospace;
  font-size: 85%;
}

.prose :deep(pre) {
  background: #f6f8fa;
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
}

.prose :deep(blockquote) {
  border-left: 4px solid #dfe2e5;
  margin: 1em 0;
  padding-left: 1em;
  color: #6a737d;
}

.toolbar-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  margin-left: 0.5rem;
  transition: all 0.2s ease;
}

.toolbar-button:hover {
  background: #f8f9fa;
}

.toolbar-button.active {
  background: #e9ecef;
}

.toolbar-button.primary {
  background: #0366d6;
  color: white;
  border-color: #0366d6;
}

.toolbar-button.primary:hover {
  background: #0255b3;
}

.toolbar-button.loading {
  background: #f8f9fa;
  color: #666;
  cursor: not-allowed;
}

.toolbar-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  background: white;
  color: #24292e;
  font-size: 14px;
  cursor: pointer;
}

.login-button:hover {
  background: #f6f8fa;
}
</style>
