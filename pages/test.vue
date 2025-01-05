<template>
  <div class="page-wrapper">
    <h1>Test Editor</h1>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <ClientOnly v-else>
      <TiptapEditor
        v-if="content"
        v-model="content"
        @save="saveContent"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const content = ref('# Test Content\n\nThis is a test editor.')

const saveContent = (newContent) => {
  console.log('Content:', newContent)
  alert('Content logged to console')
}
</script>

<style scoped>
.page-wrapper {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}
</style>
