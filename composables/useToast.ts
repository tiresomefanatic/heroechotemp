import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error'
}

const toasts = ref<Toast[]>([])
let nextId = 0

export const useToast = () => {
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = nextId++
    const toast = { id, message, type }
    toasts.value.push(toast)
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      const index = toasts.value.findIndex(t => t.id === id)
      if (index !== -1) {
        toasts.value.splice(index, 1)
      }
    }, 3000)
  }

  return {
    toasts,
    showToast
  }
}
