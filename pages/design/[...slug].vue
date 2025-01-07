// [...slug].vue
<template>
  <div class="page-wrapper">
    <ClientOnly>
      <div v-if="data">
        <header class="site-header">
          <div class="header-content">
            <NuxtLink to="/" class="logo"
              >ECHO<span class="logo-dot">•</span></NuxtLink
            >
            <nav class="main-nav">
              <NuxtLink to="/design" class="active">Design</NuxtLink>
              <NuxtLink to="/develop">Develop</NuxtLink>
              <NuxtLink to="/contribute">Contribute</NuxtLink>
              <NuxtLink to="/opinions">Opinions</NuxtLink>
            </nav>
            <div class="search-box">
              <input type="text" placeholder="Search" />
            </div>
          </div>
        </header>

        <div class="content-area" :class="{ 'editing-mode': isEditing }">
          <aside v-if="!isEditing" class="sidebar">
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
                <ContentRenderer :value="data" />
              </div>
            </ClientOnly>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { queryContent } from "#imports";
import { useGithub } from "~/composables/useGithub";
import { useToast } from "~/composables/useToast";
import TiptapEditor from "~/components/TiptapEditor.vue";
import DesignSidebar from "~/components/DesignSidebar.vue";

const route = useRoute();
const slug = route.params.slug || [];
const path = Array.isArray(slug) ? slug.join("/") : slug;

// Initialize GitHub functionality
const { getRawContent, saveFileContent, isLoggedIn, currentBranch } = useGithub();
const { showToast } = useToast();

const loading = ref(false);
const isEditing = ref(false);
const editorContent = ref("");

// Fetch initial content for the page
const { data, refresh } = await useAsyncData(`content-${path}`, () =>
  queryContent("design", ...slug).findOne()
);

// Compute the file path for GitHub operations
const contentPath = computed(() => {
  const designPrefix = "/design/";
  const currentPath = route.path;
  const pathAfterDesign = currentPath.startsWith(designPrefix)
    ? currentPath.slice(designPrefix.length)
    : "";
  const basePath = pathAfterDesign || "index";
  return `content/design/${basePath}.md`;
});

// Load content from current branch
const loadContent = async () => {
  loading.value = true;
  try {
    console.log(`Loading content from branch: ${currentBranch.value}`);
    const content = await getRawContent(
      "tiresomefanatic",
      "heroechotemp",
      contentPath.value,
      currentBranch.value
    );
    editorContent.value = content;
  } catch (error) {
    console.error(`Error loading content from branch ${currentBranch.value}:`, error);
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
  await loadContent();
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
      isEditing.value = false;
      await refresh();
    } else {
      throw new Error(`Failed to save to branch: ${currentBranch.value}`);
    }
  } catch (error) {
    console.error(`Error saving to branch ${currentBranch.value}:`, error);
    showToast({
      title: "Error",
      message: `Failed to save to branch: ${currentBranch.value}`,
      type: "error",
    });
  }
};

// Handle content change
const handleContentChange = (newContent: string) => {
  editorContent.value = newContent;
};

// Handle editor error
const handleEditorError = (error) => {
  showToast({
    title: "Editor Error",
    message: error.message,
    type: "error",
  });
};

// Handle exit editor
const exitEditor = () => {
  isEditing.value = false;
};

// Watch for branch changes
watch(currentBranch, async (newBranch) => {
  if (isEditing.value) {
    console.log(`Branch changed to: ${newBranch}, reloading content...`);
    await loadContent();
  }
});
</script>
<style scoped>
.page-wrapper {
  min-height: 100vh;
  position: relative;
}

.site-header {
  height: 64px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 48px;
}

.logo {
  font-weight: 600;
  font-size: 20px;
  text-decoration: none;
  color: inherit;
}

.logo-dot {
  color: #4361ee;
  margin-left: 2px;
}

.main-nav {
  display: flex;
  gap: 32px;
}

.main-nav a {
  text-decoration: none;
  color: #6b7280;
  font-size: 14px;
}

.main-nav a.active {
  color: inherit;
}

.search-box input {
  width: 240px;
  height: 36px;
  padding: 0 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
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

.prose {
  max-width: 720px;
  margin: 0 auto;
}
</style>
