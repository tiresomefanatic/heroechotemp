<template>
  <div class="editor-wrapper">
    <textarea
      v-model="localContent"
      class="markdown-editor"
      @input="handleInput"
      placeholder="Start writing..."
    ></textarea>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:content', 'save'])

const localContent = ref(props.content)

// Watch for content changes from parent
watch(() => props.content, (newContent) => {
  localContent.value = newContent
})

const handleInput = () => {
  emit('update:content', localContent.value)
}

// Handle Ctrl+S or Cmd+S
const handleSave = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    emit('save', localContent.value)
  }
}

// Add event listener for save shortcut
onMounted(() => {
  window.addEventListener('keydown', handleSave)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleSave)
})
</script>

<style scoped>
.editor-wrapper {
  height: calc(100vh - 64px);
  background: white;
}

.markdown-editor {
  width: 100%;
  height: 100%;
  padding: 32px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  background: white;
  border: none;
  resize: none;
  outline: none;
}

.markdown-editor:focus {
  outline: none;
}
</style>
