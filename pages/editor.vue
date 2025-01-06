<template>
  <div>
    <ClientOnly>
      <template v-if="isAuthenticated">
        <Editor />
      </template>
      <template v-else>
        <div class="unauthorized-message">
          <p class="text-xl text-center py-8">Please log in to access the editor.</p>
          <div class="text-center">
            <button @click="initiateLogin" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Login with GitHub
            </button>
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup>
import { useGithubAuth } from '~/composables/useGithubAuth'

const { isAuthenticated, initiateLogin } = useGithubAuth()
</script>
