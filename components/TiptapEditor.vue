<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useToast } from "~/composables/useToast";
import { useGithub } from "~/composables/useGithub";
import { Octokit } from "@octokit/rest";
import CollaborationSidebar from "~/components/CollaborationSidebar.vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import CodeBlock from "@tiptap/extension-code-block";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import HardBreak from "@tiptap/extension-hard-break";

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

// Create Octokit instance with stored token
const getOctokit = () => {
  if (!process.client) return null;
  const token = localStorage.getItem("github_token");
  if (!token) return null;
  return new Octokit({ auth: token });
};

// Initialize Tiptap editor
onMounted(() => {
  editor.value = new Editor({
    extensions: [
      Document,
      Paragraph.configure({
        HTMLAttributes: {
          class: "editor-paragraph",
        },
      }),
      Text,
      HardBreak,
      CodeBlock.configure({
        HTMLAttributes: {
          class: "editor-code-block",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "editor-bullet-list",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "editor-ordered-list",
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "editor-list-item",
        },
      }),
      StarterKit.configure({
        document: false,
        paragraph: false,
        text: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        codeBlock: false,
        //  horizontalRule: true,
        //  hardBreak: true,
      }),
    ],
    content: props.content,
    editorProps: {
      attributes: {
        class: "prose-editor",
        spellcheck: "false",
      },
      handleDrop: (view, event, slice, moved) => {
        event.preventDefault();
        return true;
      },
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData("text/plain");
        if (text) {
          view.dispatch(view.state.tr.insertText(text));
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
    onTransaction: ({ editor }) => {
      localContent.value = editor.getHTML();
      emit("update:content", editor.getHTML());
    },
  });
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

// Watch for content changes from parent
watch(
  () => props.content,
  (newContent) => {
    if (newContent !== undefined) {
      localContent.value = newContent;
      originalContent.value = newContent;
      if (editor.value) {
        editor.value.commands.setContent(newContent);
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

// Watch local content changes
watch(localContent, (newContent) => {
  emit("update:content", newContent);
});

// Computed properties
const hasChanges = computed(() => {
  const isDifferent = localContent.value !== originalContent.value;
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
    if (!isLoggedIn.value) {
      throw new Error("Please log in to GitHub first");
    }

    emit("save", localContent.value);
    originalContent.value = localContent.value;

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
      message:
        error instanceof Error
          ? error.message
          : "Failed to commit changes. Please try again.",
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

        <div class="editor-content">
          <template v-if="!previewMode">
            <div class="tiptap-toolbar" v-if="editor">
              <button @click="editor.chain().focus().toggleBold().run()">
                Bold
              </button>
              <button @click="editor.chain().focus().toggleItalic().run()">
                Italic
              </button>
              <button
                @click="
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                "
              >
                H1
              </button>
              <button
                @click="
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                "
              >
                H2
              </button>
              <button @click="editor.chain().focus().toggleBulletList().run()">
                Bullet List
              </button>
              <button @click="editor.chain().focus().toggleOrderedList().run()">
                Ordered List
              </button>
              <button @click="editor.chain().focus().toggleCodeBlock().run()">
                Code Block
              </button>
            </div>
            <editor-content
              :editor="editor"
              class="markdown-editor"
              :class="{ 'has-changes': hasChanges }"
            />
          </template>

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

<style>
/* Global editor styles */
.prose-editor {
  flex: 1;
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: normal;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  font-size: 0.875rem !important;
  line-height: 1.5 !important;
  color: #d4d4d4 !important;
  background: #1e1e1e;
  padding: 1rem !important;
  outline: none !important;
  min-height: 100vh;
  overflow-y: auto;
}

.prose-editor p {
  margin: 0 !important;
  white-space: pre-wrap !important;
  word-break: keep-all !important;
  font-family: inherit !important;
  color: #d4d4d4 !important;
}

.prose-editor pre {
  margin: 0 !important;
  padding: 1rem !important;
  background: #2d2d2d !important;
  border-radius: 4px !important;
  overflow-x: auto !important;
}

.prose-editor code {
  font-family: inherit !important;
  background: transparent !important;
  color: #d4d4d4 !important;
}

.editor-code-block {
  background: #2d2d2d !important;
  color: #d4d4d4 !important;
  padding: 0.5rem !important;
  border-radius: 4px !important;
  font-family: inherit !important;
  white-space: pre !important;
}

.editor-paragraph {
  margin: 0 !important;
}

.editor-bullet-list,
.editor-ordered-list {
  margin: 0 !important;
  padding-left: 1.5rem !important;
}

.editor-list-item {
  margin: 0 !important;
}
</style>

<style scoped>
.editor-wrapper {
  height: calc(100vh - 64px);
  background: #1e1e1e;
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
  border-bottom: 1px solid #2d2d2d;
  background: #252526;
}

.editor-content {
  flex: 1;
  overflow: hidden;
  position: relative;
  background: #1e1e1e;
  display: flex;
  flex-direction: column;
}

.markdown-editor {
  flex: 1;
  overflow-y: auto;
}

.markdown-preview {
  padding: 2rem;
  overflow-y: auto;
  background-color: white;
  height: 100%;
  width: 100%;
}

.tiptap-toolbar {
  padding: 0.5rem;
  border-bottom: 1px solid #2d2d2d;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  background: #252526;
}

.tiptap-toolbar button {
  padding: 0.25rem 0.5rem;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  background: #252526;
  color: #cccccc;
  cursor: pointer;
  font-size: 0.875rem;
}

.tiptap-toolbar button.is-active {
  background: #37373d;
  border-color: #0366d6;
}

.tiptap-toolbar button:hover {
  background: #2d2d2d;
}

.toolbar-button {
  padding: 0.5rem 1rem;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  background: #252526;
  color: #cccccc;
  cursor: pointer;
  font-size: 0.875rem;
  margin-left: 0.5rem;
}

.toolbar-button:hover {
  background: #2d2d2d;
}

.toolbar-button.active {
  background: #37373d;
}

.toolbar-button.primary {
  background: #0366d6;
  color: white;
  border-color: #0366d6;
}

.toolbar-button.primary:hover {
  background: #0255b3;
}

.file-path {
  color: #cccccc;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
}

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
