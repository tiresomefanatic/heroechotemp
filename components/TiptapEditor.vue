# TiptapEditor.vue
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Image from "@tiptap/extension-image";
import { Extension } from "@tiptap/core";
import CollaborationSidebar from "~/components/CollaborationSidebar.vue";
import { useGithub } from "~/composables/useGithub";
import { useToast } from "~/composables/useToast";

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
const editor = ref<Editor | null>(null);

// Initialize composables
const { showToast } = useToast();
const github = useGithub();
const { isLoggedIn } = github;

// Initialize Tiptap editor
onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        document: {
          preserveWhitespace: "full",
        },
        paragraph: {
          HTMLAttributes: {
            class: null,
          },
        },
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: null,
        },
      }),
    ],
    content: props.content,
    editorProps: {
      attributes: {
        class: "prose-editor",
        spellcheck: "false",
      },
      transformPastedHTML: (html) => {
        return html
          .replace(/<p class="editor-paragraph">/g, "<p>")
          .replace(/\s+>/g, ">")
          .replace(/>\s+</g, "><")
          .trim();
      },
    },
    onUpdate: ({ editor: ed }) => {
      const newContent = ed.getHTML();
      if (newContent !== localContent.value) {
        localContent.value = newContent;
        emit("update:content", newContent);
      }
    },
  });

  // Set initial content
  if (props.content) {
    localContent.value = props.content;
    originalContent.value = props.content;
  }
});

// Clean up HTML before saving
const cleanupHtml = (html: string) => {
  return html
    .replace(/<p class="editor-paragraph">/g, "<p>")
    .replace(/\s+>/g, ">")
    .replace(/>\s+</g, "><")
    .replace(/&nbsp;/g, " ")
    .trim();
};

// Watch for content changes from parent
watch(
  () => props.content,
  (newContent) => {
    if (newContent !== undefined && newContent !== localContent.value) {
      localContent.value = newContent;
      originalContent.value = newContent;
      if (editor.value) {
        editor.value.commands.setContent(newContent, false);
      }
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

// Computed properties
const hasChanges = computed(() => {
  const normalize = (str: string) => str.trim().replace(/\s+/g, " ");
  const current = normalize(localContent.value);
  const original = normalize(originalContent.value);
  return current !== original;
});

const previewContent = computed(() => {
  if (!localContent.value) return "";
  return localContent.value; // Return the HTML content directly for preview
});

// Save content function
const saveToDisk = async () => {
  if (!hasChanges.value || isSaving.value) return;

  isSaving.value = true;
  try {
    if (!isLoggedIn.value) {
      throw new Error("Please log in to GitHub first");
    }

    const cleanContent = cleanupHtml(localContent.value);
    emit("save", cleanContent);
    originalContent.value = cleanContent;

    versionHistory.value.push({
      timestamp: new Date(),
      content: cleanContent,
      description: `Update ${props.filePath}`,
    });

    if (versionHistory.value.length > 10) {
      versionHistory.value.shift();
    }
  } catch (error) {
    console.error("Save error:", error);
    showToast({
      title: "Error",
      message:
        error instanceof Error ? error.message : "Failed to save changes",
      type: "error",
    });
    emit("error", error as Error);
  } finally {
    isSaving.value = false;
  }
};

// Cleanup on unmount
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<template>
  <div class="editor-wrapper">
    <div v-if="!isLoggedIn" class="login-prompt">
      <p class="login-message">Please sign in with GitHub to edit this file</p>
      <button @click="github.login" class="login-button">
        Sign in with GitHub
      </button>
    </div>

    <div v-else class="editor-layout">
      <div class="editor-main">
        <div class="editor-toolbar">
          <div class="toolbar-left">
            <span class="file-path">{{ props.filePath }}</span>
          </div>

          <div class="toolbar-right">
            <button
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

        <div class="editor-content">
          <template v-if="!previewMode">
            <div class="tiptap-toolbar" v-if="editor">
              <button
                @click="editor.chain().focus().toggleBold().run()"
                :class="{ 'is-active': editor.isActive('bold') }"
              >
                Bold
              </button>
              <button
                @click="editor.chain().focus().toggleItalic().run()"
                :class="{ 'is-active': editor.isActive('italic') }"
              >
                Italic
              </button>
              <button
                @click="
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                "
                :class="{
                  'is-active': editor.isActive('heading', { level: 1 }),
                }"
              >
                H1
              </button>
              <button
                @click="
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                "
                :class="{
                  'is-active': editor.isActive('heading', { level: 2 }),
                }"
              >
                H2
              </button>
              <button
                @click="editor.chain().focus().toggleBulletList().run()"
                :class="{ 'is-active': editor.isActive('bulletList') }"
              >
                List
              </button>
            </div>
            <editor-content
              :editor="editor"
              class="markdown-editor"
              :class="{ 'has-changes': hasChanges }"
            />
          </template>

          <div v-else class="preview-wrapper">
            <div class="preview-content" v-html="previewContent"></div>
          </div>
        </div>
      </div>

      <CollaborationSidebar />
    </div>
  </div>
</template>

<style>
.editor-wrapper {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background: white;
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
  background: white;
}

.editor-content {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  background: white;
  overflow: hidden;
}

.markdown-editor {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: white;
}

/* Preview styles */
.preview-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  overflow-y: auto;
}

.preview-content {
  padding: 2rem;
  background: white;
  color: #000000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
}

/* Editor styles */
.prose-editor {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #000000;
}

/* Common content styles */
.prose-editor h1,
.preview-content h1 {
  font-size: 2em;
  font-weight: 600;
  margin: 1em 0 0.5em;
  color: #000000;
}

.prose-editor h2,
.preview-content h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin: 1em 0 0.5em;
  color: #000000;
}

.prose-editor h3,
.preview-content h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin: 1em 0 0.5em;
  color: #000000;
}

.prose-editor p,
.preview-content p {
  margin: 1em 0;
  color: #000000;
}

.prose-editor ul,
.prose-editor ol,
.preview-content ul,
.preview-content ol {
  margin: 1em 0;
  padding-left: 1.5em;
  color: #000000;
}

.prose-editor li,
.preview-content li {
  margin: 0.5em 0;
  color: #000000;
}

/* Images */
.prose-editor img,
.preview-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1.5em 0;
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 4px;
}

/* Layout classes */
.design-layout {
  display: flex;
  gap: 2rem;
}

.design-content {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
}

/* Section styles */
.logo-section {
  margin: 2rem 0;
}

.reproduction-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.logo-dark {
  background: #000;
  padding: 2rem;
  border-radius: 4px;
}

.logo-light {
  background: #fff;
  padding: 2rem;
  border-radius: 4px;
  border: 1px solid #eee;
}

/* Toolbar styles */
.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.tiptap-toolbar {
  padding: 0.5rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.tiptap-toolbar button,
.toolbar-button {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #374151;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.tiptap-toolbar button:hover,
.toolbar-button:hover {
  background: #f9fafb;
}

.tiptap-toolbar button.is-active {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.toolbar-button.primary {
  background: #4361ee;
  color: white;
  border-color: #4361ee;
}

.toolbar-button.primary:hover {
  background: #3651d4;
}

/* File path */
.file-path {
  color: #374151;
  font-size: 0.875rem;
}

/* Login prompt */
.login-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: #1e1e1e;
  color: #cccccc;
}

.login-button {
  padding: 0.5rem 1rem;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  background: #252526;
  color: #cccccc;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.login-button:hover {
  background: #2d2d2d;
}
</style>
