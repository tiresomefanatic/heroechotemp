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

// State management
const localContent = ref("");
const originalContent = ref("");
const isSaving = ref(false);
const previewMode = ref(false);
const editor = ref<Editor | null>(null);
const isInitialContent = ref(true);

// Initialize composables
const { showToast } = useToast();
const github = useGithub();
const { isLoggedIn } = github;

// Debug mode detection
const showDebugInfo = computed(() => {
  return process.env.NODE_ENV === "development";
});

// Format HTML while preserving structure and formatting
const formatHTML = (html: string): string => {
  // First, preserve inline formatting elements by replacing them temporarily
  let formattedHTML = html
    .replace(/<strong>/g, "§§STRONG§§")
    .replace(/<\/strong>/g, "§§/STRONG§§")
    .replace(/<em>/g, "§§EM§§")
    .replace(/<\/em>/g, "§§/EM§§");

  // Add newlines and indentation for block elements
  formattedHTML = formattedHTML
    .replace(/></g, ">\n<") // Add newlines between elements
    .replace(
      /(<div[^>]*>|<\/div>|<p>|<\/p>|<h[1-6]>|<\/h[1-6]>|<ul>|<\/ul>|<ol>|<\/ol>|<li>|<\/li>)/g,
      (match) => `\n${match}\n`
    )
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line, _, array) => {
      // Calculate indentation level
      const indentLevel = array
        .slice(0, array.indexOf(line))
        .reduce((count, prevLine) => {
          if (prevLine.match(/<(div|p|h[1-6]|ul|ol|li)[^>]*>/)) count++;
          if (prevLine.match(/<\/(div|p|h[1-6]|ul|ol|li)>/)) count--;
          return count;
        }, 0);

      return "  ".repeat(Math.max(0, indentLevel)) + line;
    })
    .join("\n");

  // Restore inline formatting elements
  formattedHTML = formattedHTML
    .replace(/§§STRONG§§/g, "<strong>")
    .replace(/§§\/STRONG§§/g, "</strong>")
    .replace(/§§EM§§/g, "<em>")
    .replace(/§§\/EM§§/g, "</em>");

  return formattedHTML;
};

// Custom Document extension to handle block-level elements
const CustomDocument = Document.extend({
  content: "block+",
});

// Initialize editor
onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        document: false,
      }),
      CustomDocument,
      Image.configure({
        inline: true,
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose-editor",
        spellcheck: "false",
      },
    },
    onUpdate: ({ editor: ed }) => {
      // Get new content and format it
      const rawContent = ed.getHTML();
      const formattedContent = formatHTML(rawContent);

      // Update local content
      localContent.value = formattedContent;

      // Log content state for debugging
      console.log("Content Update:", {
        raw: rawContent.slice(0, 100),
        formatted: formattedContent.slice(0, 100),
        hasInlineFormatting:
          formattedContent.includes("<strong>") ||
          formattedContent.includes("<em>"),
      });

      // Emit update event
      emit("update:content", formattedContent);
    },
  });

  // Set initial content
  if (props.content) {
    const formattedContent = formatHTML(props.content);

    console.log("Setting initial content:", {
      contentLength: formattedContent.length,
      hasFormatting:
        formattedContent.includes("<strong>") ||
        formattedContent.includes("<em>"),
    });

    // Initialize editor and content states
    editor.value.commands.setContent(formattedContent);
    localContent.value = formattedContent;
    originalContent.value = formattedContent;
  }
});

// Watch for content changes from parent
watch(
  () => props.content,
  (newContent, oldContent) => {
    if (newContent !== undefined && editor.value) {
      const formattedContent = formatHTML(newContent);

      // Store cursor position
      const currentCursor = editor.value.state.selection;

      // Update editor content
      editor.value.commands.setContent(formattedContent);
      localContent.value = formattedContent;

      // Only set original content on initial load
      if (isInitialContent.value) {
        originalContent.value = formattedContent;
        isInitialContent.value = false;
      }

      // Restore cursor position
      if (currentCursor) {
        editor.value.commands.setTextSelection(currentCursor.from);
      }

      console.log("Content updated from prop:", {
        hasChanges: hasChanges.value,
        hasFormatting:
          formattedContent.includes("<strong>") ||
          formattedContent.includes("<em>"),
      });
    }
  }
);

// Improved change detection
const hasChanges = computed(() => {
  if (!localContent.value || !originalContent.value) {
    return false;
  }

  // Compare formatted content
  const isDifferent = localContent.value !== originalContent.value;

  // Log change detection details
  console.log("Change Detection:", {
    isDifferent,
    localFormatting: localContent.value.match(/<(strong|em)>/g)?.length || 0,
    originalFormatting:
      originalContent.value.match(/<(strong|em)>/g)?.length || 0,
  });

  return isDifferent;
});

// Preview content
const previewContent = computed(() => {
  return localContent.value || "";
});

// Save content
const saveToDisk = async () => {
  if (!hasChanges.value || isSaving.value) return;

  isSaving.value = true;
  try {
    if (!isLoggedIn.value) {
      throw new Error("Please log in to GitHub first");
    }

    // Ensure content is properly formatted before saving
    const contentToSave = formatHTML(localContent.value);
    emit("save", contentToSave);
    originalContent.value = contentToSave;
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

// Cleanup
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<template>
  <div class="editor-wrapper">
    <!-- Debug info panel -->
    <div v-if="showDebugInfo" class="debug-info">
      <div class="debug-panel">
        <pre>Has changes: {{ hasChanges }}</pre>
        <pre>Local content length: {{ localContent?.length }}</pre>
        <pre>Original content length: {{ originalContent?.length }}</pre>
        <pre>Preview mode: {{ previewMode }}</pre>
      </div>
    </div>

    <!-- Login prompt -->
    <div v-if="!isLoggedIn" class="login-prompt">
      <p class="login-message">Please sign in with GitHub to edit this file</p>
      <button @click="github.login" class="login-button">
        Sign in with GitHub
      </button>
    </div>

    <!-- Editor layout -->
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

/* Debug panel styles */
.debug-info {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  font-family: monospace;
  font-size: 12px;
  max-width: 400px;
  overflow: auto;
}

.debug-panel pre {
  margin: 5px 0;
  white-space: pre-wrap;
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

.markdown-editor.has-changes {
  background: #fafafa;
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

.prose-editor {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #000000;
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

/* Editor styles */
.prose-editor h1 {
  font-size: 2em;
  font-weight: 600;
  margin: 1em 0 0.5em;
}

.prose-editor h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin: 1em 0 0.5em;
}

.prose-editor h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin: 1em 0 0.5em;
}

.prose-editor p {
  margin: 1em 0;
}

.prose-editor ul,
.prose-editor ol {
  margin: 1em 0;
  padding-left: 1.5em;
}

.prose-editor li {
  margin: 0.5em 0;
}

.prose-editor img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1.5em 0;
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 4px;
}
</style>
