<template>
  <NuxtLayout>
    <div class="page-wrapper">
      <div v-if="pending">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <ClientOnly v-else>
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
                <button @click="toggleEdit" class="edit-button">
                  {{ isEditing ? "Exit" : "Edit" }}
                </button>
              </div>

              <div v-if="isEditing" class="editor-container">
                <TiptapEditor
                  :content="editorContent"
                  :filePath="contentPath"
                  @update:content="updateContent"
                  @save="saveContent"
                />
              </div>
              <div v-else class="prose">
                <ContentRenderer :value="data" />
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import DesignSidebar from "~/components/DesignSidebar.vue";

// Get the content path for the API
const contentPath = computed(() => "content/design/index.md");

const { data, pending, error, refresh } = await useAsyncData(
  'content-design',
  () => queryContent("design").findOne()
);

const editorContent = ref("");
const isEditing = ref(false);

// Function to fetch raw markdown content
async function fetchRawContent() {
  try {
    const filepath = contentPath.value;
    console.log("Fetching raw content from:", filepath);

    const response = await $fetch("/api/raw-content", {
      params: { path: filepath },
    });

    if (response?.content) {
      console.log("Raw content fetched successfully");
      editorContent.value = response.content;
    } else {
      console.error("No content received from API");
      const bodyContent = data.value?.body?.content;
      if (bodyContent) {
        console.log("Using body content from Nuxt Content");
        editorContent.value = bodyContent;
      } else {
        console.error("No content available");
        editorContent.value = "";
      }
    }
  } catch (err) {
    console.error("Error fetching raw content:", err);
    console.error("Failed path:", filepath);
    const bodyContent = data.value?.body?.content;
    if (bodyContent) {
      console.log("Using body content from Nuxt Content after error");
      editorContent.value = bodyContent;
    } else {
      console.error("No fallback content available");
      editorContent.value = "";
    }
  }
}

// Call fetchRawContent when editing is enabled
async function toggleEdit() {
  if (!isEditing.value) {
    await fetchRawContent();
  }
  isEditing.value = !isEditing.value;
}

const updateContent = (newContent) => {
  editorContent.value = newContent;
};

const saveContent = async (content) => {
  try {
    const filePath = contentPath.value;
    console.log("Saving content to:", filePath);

    const response = await $fetch("/api/raw-content", {
      method: "POST",
      body: {
        path: filePath,
        content,
      },
    });

    if (response.success) {
      alert("Content saved successfully!");
      isEditing.value = false;
      // Refresh the page data
      await refresh();
    } else {
      throw new Error("Failed to save content");
    }
  } catch (error) {
    console.error("Error saving:", error);
    alert("Failed to save content");
  }
};
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
  flex: 1;
  display: flex;
  background: #f9fafb;
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
}

.editor-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.prose {
  max-width: 720px;
  margin: 0 auto;
}
</style>