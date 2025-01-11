# [...slug].vue
<template>
  <div class="page-wrapper">
    <ClientOnly>
      <div v-if="data">
        <Header />
        <div class="content-area" :class="{ 'editing-mode': isEditing }">
          <aside v-if="!isEditing && showSidebar" class="sidebar">
            <DesignSidebar />
          </aside>
          <div class="main-content">
            <div class="content-header">
              <ClientOnly>
                <button
                  v-if="!isEditing"
                  @click="handleEditClick"
                  class="edit-button"
                >
                  Edit
                </button>
                <button v-else @click="exitEditor" class="edit-button">
                  Exit
                </button>
              </ClientOnly>
            </div>

            <ClientOnly>
              <div v-if="isEditing" class="editor-container">
                <TiptapEditor
                  :content="editorContent"
                  :filePath="contentPath"
                  @update:content="handleContentChange"
                  @save="handleSave"
                  @error="handleEditorError"
                />
              </div>
              <div v-else class="prose">
                <ContentRenderer v-if="data" :value="data">
                  <template #empty>
                    <p>No content found.</p>
                  </template>
                </ContentRenderer>
              </div>
            </ClientOnly>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { queryContent } from "#imports";
import { useGithub } from "~/composables/useGithub";
import { useToast } from "~/composables/useToast";
import TiptapEditor from "~/components/TiptapEditor.vue";
import DesignSidebar from "~/components/DesignSidebar.vue";
import Header from "~/components/Header.vue";

// Initialize composables and services
const { getRawContent, saveFileContent, isLoggedIn, currentBranch } =
  useGithub();
const { showToast } = useToast();

// State management
const loading = ref(false);
const isEditing = ref(false);
const editorContent = ref(""); // Holds the current editor content
const originalContent = ref(""); // Store the initial content for comparison

// Route handling
const route = useRoute();
const slug = route.params.slug || [];
const path = Array.isArray(slug) ? slug.join("/") : slug;

// Compute whether to show sidebar
const showSidebar = computed(() => path !== "");

// Content queries for initial page load
const { data, refresh } = await useAsyncData(`content-${path}`, () => {
  if (!path) {
    return queryContent().where({ _path: "/" }).findOne();
  }
  return queryContent()
    .where({ _path: `/${path}` })
    .findOne();
});

// Compute the content file path
const contentPath = computed(() => {
  if (!path) return "content/index.md";
  return `content/${path}.md`;
});

// Load content from GitHub
const loadContent = async () => {
  loading.value = true;
  try {
    console.log(`Loading content from branch: ${currentBranch.value}`);

    // Fetch the raw content from GitHub
    const content = await getRawContent(
      "tiresomefanatic",
      "heroechotemp",
      contentPath.value,
      currentBranch.value
    );

    // Store both the editor content and original content
    editorContent.value = content;
    originalContent.value = content; // Keep track of the original content

    await refresh();

    console.log("Content loaded successfully:", {
      contentPath: contentPath.value,
      contentLength: content.length,
      excerpt: content.slice(0, 50),
    });
  } catch (error) {
    console.error(`Error loading content:`, error);
    showToast({
      title: "Error",
      message: `Failed to load content from branch: ${currentBranch.value}`,
      type: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Handle edit button click
const handleEditClick = async () => {
  if (!isLoggedIn.value) {
    showToast({
      title: "Authentication Required",
      message: "Please sign in with GitHub to edit content",
      type: "warning",
    });
    return;
  }

  isEditing.value = true;
  await loadContent(); // This will set both editorContent and originalContent
};

// Handle content changes from the editor
const handleContentChange = (newContent: string) => {
  console.log("Content changed:", {
    previousLength: editorContent.value.length,
    newLength: newContent.length,
    hasChanged: newContent !== originalContent.value,
  });

  editorContent.value = newContent;
};

// Handle content save
const handleSave = async (content: string) => {
  if (!content || !isLoggedIn.value) {
    showToast({
      title: "Error",
      message: "Please sign in to save changes",
      type: "error",
    });
    return;
  }

  try {
    console.log(`Saving to branch: ${currentBranch.value}`);
    const result = await saveFileContent(
      "tiresomefanatic",
      "heroechotemp",
      contentPath.value,
      content,
      `Update ${contentPath.value}`,
      currentBranch.value
    );

    if (result) {
      showToast({
        title: "Success",
        message: `Content saved successfully to branch: ${currentBranch.value}`,
        type: "success",
      });

      // Update both editor and original content after successful save
      originalContent.value = content;
      editorContent.value = content;

      // Refresh the page content and exit edit mode
      await refresh();
      isEditing.value = false;
    } else {
      throw new Error(`Failed to save to branch: ${currentBranch.value}`);
    }
  } catch (error) {
    console.error(`Error saving content:`, error);
    showToast({
      title: "Error",
      message: `Failed to save to branch: ${currentBranch.value}`,
      type: "error",
    });
  }
};

// Handle editor errors
const handleEditorError = (error: Error) => {
  showToast({
    title: "Editor Error",
    message: error.message,
    type: "error",
  });
};

// Handle exit editor
const exitEditor = async () => {
  // Reload the content to discard changes
  await loadContent();
  isEditing.value = false;
};

// Watch for editing mode changes
watch(
  [editorContent, isEditing],
  async ([newContent, editing], [oldContent, wasEditing]) => {
    if (editing && !wasEditing) {
      await loadContent();
    }
  }
);

// Watch for branch changes
watch(currentBranch, async (newBranch, oldBranch) => {
  if (newBranch !== oldBranch && isEditing.value) {
    console.log(
      `Branch changed from ${oldBranch} to ${newBranch}, reloading content...`
    );
    await loadContent();
  }
});

// Load initial content on mount
onMounted(async () => {
  await loadContent();
});
</script>

<style>
/* Global prose styles */
.prose {
  max-width: 720px;
  margin: 0 auto;
  color: #000000;
  font-size: 16px;
  line-height: 1.6;
}

.prose h1 {
  font-size: 2em;
  margin: 1.2em 0 0.6em;
  font-weight: 600;
  line-height: 1.2;
  color: #000000;
}

.prose h2 {
  font-size: 1.5em;
  margin: 1em 0 0.5em;
  font-weight: 600;
  line-height: 1.3;
  color: #000000;
}

.prose h3 {
  font-size: 1.25em;
  margin: 0.8em 0 0.4em;
  font-weight: 600;
  line-height: 1.4;
  color: #000000;
}

.prose p {
  margin: 1em 0;
  color: #000000;
}

.prose ul,
.prose ol {
  margin: 1em 0;
  padding-left: 1.5em;
  color: #000000;
}

.prose li {
  margin: 0.5em 0;
}

.prose a {
  color: #4361ee;
  text-decoration: underline;
}

.prose blockquote {
  border-left: 4px solid #e5e7eb;
  margin: 1.5em 0;
  padding-left: 1em;
  color: #4b5563;
}

.prose code {
  background: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: ui-monospace, monospace;
}

.prose pre {
  background: #f3f4f6;
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1.5em 0;
}

.prose pre code {
  background: none;
  padding: 0;
  font-size: 0.9em;
  color: #000000;
}

.prose img {
  max-width: 100%;
  height: auto;
  margin: 1.5em 0;
}

.prose hr {
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 2em 0;
}
</style>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  position: relative;
}

.content-area {
  display: flex;
  background: #f9fafb;
  min-height: calc(100vh - 64px);
}

.content-area.editing-mode {
  padding: 32px;
}

.sidebar {
  width: 240px;
  padding: 32px 0;
  border-right: 1px solid #e5e7eb;
  background: white;
}

.main-content {
  flex: 1;
  padding: 32px;
}

.content-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: flex-end;
}

.edit-button {
  padding: 8px 16px;
  background: #4361ee;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.edit-button:hover {
  background: #3651d4;
}

.editor-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 200px);
}
</style>
