# TiptapEditor.vue
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import { Node } from "@tiptap/core";
import Heading from "@tiptap/extension-heading";
import Text from "@tiptap/extension-text";
import Image from "@tiptap/extension-image";
import ColorWheelExtension from "../extensions/colorWheelExtension";
import CollaborationSidebar from "~/components/CollaborationSidebar.vue";
import { useGithub } from "~/composables/useGithub";
import { useToast } from "~/composables/useToast";
import { useNuxtApp } from "#app";

interface Props {
  content?: string;
  filePath: string;
}

const StyledDiv = Node.create({
  name: "styledDiv",
  group: "block",
  content: "block+",
  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        },
      },
      "data-type": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-type"),
        renderHTML: (attributes) => {
          if (!attributes["data-type"]) return {};
          return { "data-type": attributes["data-type"] };
        },
      },
    };
  },
  parseHTML() {
    return [{ tag: "div" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0];
  },
});

const GridContainer = Node.create({
  name: "gridContainer",
  group: "block",
  content: "block+",
  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "div",
        getAttrs: (node) => {
          const style = node.getAttribute("style") || "";
          return style.includes("grid") ? {} : false;
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0];
  },
});

const StyledParagraph = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },
});

const StyledHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },
});

const StyledImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },
});

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
const rawMode = ref(false);
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

// Preview key for forcing content refresh
const previewKey = computed(() => `preview-${Date.now()}`);

// Get preview path from file path
const getPreviewPath = computed(() => {
  const path = props.filePath.replace(/^content\//, "").replace(/\.md$/, "");
  return path === "index" ? "/" : path;
});

const formatHTML = (html: string): string => {
  if (!html) return "";

  html = html
    .replace(
      /<div[^>]*data-type="color-wheel"[^>]*>.*?<\/div>/g,
      "\n::color-wheel\n::\n"
    )
    .replace(
      /<div[^>]*data-type="test-component"[^>]*>.*?<\/div>/g,
      "\n::test-component\n::\n"
    );

  let formattedHTML = html
    .replace(/<strong>/g, "§§STRONG§§")
    .replace(/<\/strong>/g, "§§/STRONG§§")
    .replace(/<em>/g, "§§EM§§")
    .replace(/<\/em>/g, "§§/EM§§");

  formattedHTML = formattedHTML
    .replace(/></g, ">\n<")
    .replace(
      /(<div[^>]*>|<\/div>|<p>|<\/p>|<h[1-6]>|<\/h[1-6]>|<ul>|<\/ul>|<ol>|<\/ol>|<li>|<\/li>)/g,
      (match) => `\n${match}\n`
    )
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");

  formattedHTML = formattedHTML
    .replace(/§§STRONG§§/g, "<strong>")
    .replace(/§§\/STRONG§§/g, "</strong>")
    .replace(/§§EM§§/g, "<em>")
    .replace(/§§\/EM§§/g, "</em>");

  return formattedHTML.replace(/\n{3,}/g, "\n\n").trim();
};

const CustomDocument = Document.extend({
  content: "block+",
});

const parseMarkdownToHTML = (content: string): string => {
  if (!content) return "";

  return content
    .replace(/::color-wheel\s*::/g, '<div data-type="color-wheel"></div>')
    .replace(
      /::test-component\s*::/g,
      '<div data-type="test-component"></div>'
    );
};

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        document: false,
        paragraph: false,
        heading: false,
        bulletList: false,
        orderedList: false,
      }),
      CustomDocument,
      StyledParagraph,
      StyledHeading,
      StyledImage.configure({
        inline: true,
      }),
      StyledDiv,
      GridContainer,
      ColorWheelExtension.configure({
        HTMLAttributes: {
          class: "color-wheel-node",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose-editor",
        spellcheck: "false",
      },
      transformPastedHTML: (html) => {
        return html;
      },
    },
    onUpdate: ({ editor: ed }) => {
      const { from, to } = ed.state.selection;
      const rawContent = ed.getHTML();
      const formattedContent = formatHTML(rawContent);

      if (formattedContent !== localContent.value) {
        localContent.value = formattedContent;
        emit("update:content", formattedContent);

        setTimeout(() => {
          if (editor.value) {
            editor.value.commands.setTextSelection({ from, to });
          }
        }, 0);
      }
    },
    parseOptions: {
      preserveWhitespace: true,
    },
  });

  if (props.content) {
    const parsedContent = parseMarkdownToHTML(props.content);
    const formattedContent = formatHTML(parsedContent);
    editor.value.commands.setContent(formattedContent, false);
    localContent.value = formattedContent;
    originalContent.value = formattedContent;
  }

  const initialContent = editor.value.getHTML();
  if (initialContent) {
    const formattedContent = formatHTML(initialContent);
    emit("update:content", formattedContent);
  }
});

watch(
  () => props.content,
  (newContent, oldContent) => {
    if (newContent !== undefined && editor.value) {
      const { from, to } = editor.value.state.selection;
      const parsedContent = parseMarkdownToHTML(newContent);
      const formattedContent = formatHTML(parsedContent);

      if (formattedContent !== localContent.value || isInitialContent.value) {
        editor.value.commands.setContent(formattedContent, false);
        localContent.value = formattedContent;

        if (isInitialContent.value) {
          originalContent.value = formattedContent;
          isInitialContent.value = false;
          emit("update:content", formattedContent);
        }

        setTimeout(() => {
          if (editor.value) {
            editor.value.commands.setTextSelection({ from, to });
          }
        }, 0);
      }
    }
  },
  { immediate: true }
);

const hasChanges = computed(() => {
  if (!localContent.value || !originalContent.value) return false;
  return localContent.value !== originalContent.value;
});

const saveToDisk = async () => {
  if (!hasChanges.value || isSaving.value) return;

  isSaving.value = true;
  try {
    if (!isLoggedIn.value) {
      throw new Error("Please log in to GitHub first");
    }

    const contentToSave = formatHTML(localContent.value);

    // Clear Nuxt's content cache before saving
    if (process.client) {
      const nuxtApp = useNuxtApp();
      const storage = nuxtApp.$content?.storage;
      if (storage) {
        await storage.clearAll();
      }
    }

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

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<template>
  <div class="editor-wrapper">
    <div v-if="showDebugInfo" class="debug-info">
      <div class="debug-panel">
        <pre>Has changes: {{ hasChanges }}</pre>
        <pre>Local content length: {{ localContent?.length }}</pre>
        <pre>Original content length: {{ originalContent?.length }}</pre>
        <pre>Preview mode: {{ previewMode }}</pre>
        <pre>Raw mode: {{ rawMode }}</pre>
      </div>
    </div>

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
              :class="{ active: rawMode }"
              @click="rawMode = !rawMode"
            >
              {{ rawMode ? "Normal" : "Raw" }}
            </button>

            <button
              class="toolbar-button"
              :class="{ active: previewMode }"
              @click="previewMode = !previewMode"
              v-if="!rawMode"
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
          <template v-if="!previewMode && !rawMode">
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
              <button
                @click="
                  editor
                    .chain()
                    .focus()
                    .insertContent({
                      type: 'colorWheel',
                    })
                    .run()
                "
                class="toolbar-button"
              >
                Add Color Wheel
              </button>
            </div>
            <editor-content
              :editor="editor"
              class="markdown-editor"
              :class="{ 'has-changes': hasChanges }"
            />
          </template>

          <div v-else-if="rawMode" class="raw-content-wrapper">
            <pre class="raw-content">{{ localContent }}</pre>
          </div>

          <div v-else class="preview-wrapper">
            <div class="prose">
              <ContentDoc
                :path="getPreviewPath"
                :key="previewKey"
                :head="false"
              >
                <template #empty>
                  <p>No content found.</p>
                </template>
                <template #not-found>
                  <p>Content not found. Path: {{ getPreviewPath }}</p>
                </template>
              </ContentDoc>
            </div>
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
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: white;
}

.preview-content {
  max-width: 720px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
}

.prose {
  color: #000000;
  font-size: 16px;
  line-height: 1.6;
}

.prose h1 {
  font-size: 2em;
  margin: 1.2em 0 0.6em;
  font-weight: 600;
  line-height: 1.2;
}

.prose h2 {
  font-size: 1.5em;
  margin: 1em 0 0.5em;
  font-weight: 600;
  line-height: 1.3;
}

.prose p {
  margin: 1em 0;
}

.prose ul,
.prose ol {
  margin: 1em 0;
  padding-left: 1.5em;
}

.prose li {
  margin: 0.5em 0;
}

.prose img {
  max-width: 100%;
  height: auto;
  margin: 1.5em 0;
}

/* Editor styles */
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

.toolbar-button.active {
  background: #f3f4f6;
  border-color: #d1d5db;
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

/* Raw content styles */
.raw-content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: #1e1e1e;
}

.raw-content {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #d4d4d4;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  tab-size: 2;
}
</style>
