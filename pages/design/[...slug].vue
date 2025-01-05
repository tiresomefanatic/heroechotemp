<template>
  <div class="page-wrapper">
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <ClientOnly v-else>
      <div v-if="data">
        <header class="site-header">
          <div class="header-content">
            <NuxtLink to="/" class="logo">ECHO<span class="logo-dot">•</span></NuxtLink>
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
              <button 
                @click="toggleEdit"
                class="edit-button"
              >
                {{ isEditing ? 'Preview' : 'Edit' }}
              </button>
            </div>

            <div v-if="isEditing" class="editor-container">
              <TiptapEditor
                :content="editorContent"
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
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import DesignSidebar from '~/components/DesignSidebar.vue'

const route = useRoute()
const slug = route.params.slug || []
const path = Array.isArray(slug) ? slug.join('/') : slug

const { data, pending, error, refresh } = await useAsyncData(
  `content-${path}`,
  () => queryContent('design', path).findOne()
)

const editorContent = ref('')
const isEditing = ref(false)

// Function to fetch raw markdown content
async function fetchRawContent() {
  try {
    const filePath = `design/${path}.md`
    console.log('Fetching raw content from:', filePath)
    
    const response = await $fetch('/api/raw-content', {
      params: { path: filePath }
    })
    
    console.log('Raw content fetched:', response.content)
    editorContent.value = response.content
  } catch (err) {
    console.error('Error fetching raw content:', err)
  }
}

async function toggleEdit() {
  isEditing.value = !isEditing.value
  if (isEditing.value) {
    await fetchRawContent()
  }
}

const updateContent = (newContent) => {
  editorContent.value = newContent
}

const saveContent = async (content) => {
  try {
    const filePath = `design/${path}.md`
    console.log('Saving content to:', filePath)
    
    const response = await $fetch('/api/raw-content', {
      method: 'POST',
      body: {
        path: filePath,
        content
      }
    })
    
    if (response.success) {
      alert('Content saved successfully!')
      isEditing.value = false
      // Refresh the page data
      await refresh()
    } else {
      throw new Error('Failed to save content')
    }
  } catch (error) {
    console.error('Error saving:', error)
    alert('Failed to save content')
  }
}
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header {
  height: 64px;
  border-bottom: 1px solid #E5E7EB;
  background: white;
}

.header-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-weight: 600;
  font-size: 16px;
  color: #000;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.logo-dot {
  color: #4361EE;
  margin-left: 2px;
}

.main-nav {
  display: flex;
  gap: 32px;
}

.main-nav a {
  text-decoration: none;
  color: #6B7280;
  font-size: 14px;
}

.main-nav a.active {
  color: #000;
}

.search-box input {
  width: 240px;
  height: 36px;
  padding: 0 16px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 14px;
}

.content-area {
  flex: 1;
  display: flex;
  background: #F9FAFB;
}

.content-area.editing-mode {
  background: white;
}

.sidebar {
  width: 240px;
  padding: 32px 0;
  border-right: 1px solid #E5E7EB;
  background: white;
}

.main-content {
  flex: 1;
  padding: 32px;
  min-width: 0;
}

.content-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 32px;
}

.edit-button {
  padding: 8px 16px;
  background: #4361EE;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.prose {
  max-width: 720px;
  margin: 0 auto;
}

.editor-container {
  height: calc(100vh - 128px);
}
</style>
