<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Welcome to Hero Echo</h1>
    
    <div v-if="!isAuthenticated" class="mb-4">
      <button @click="login" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Login with GitHub
      </button>
    </div>
    
    <div v-else class="mb-4">
      <p class="mb-2">You are logged in!</p>
      <NuxtLink to="/editor" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block">
        Go to Editor
      </NuxtLink>
    </div>

    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Available Pages:</h2>
      <ul class="space-y-2">
        <li>
          <NuxtLink to="/design/foundation/illustration" class="text-blue-600 hover:underline">
            Illustration Guidelines
          </NuxtLink>
        </li>
        <li v-if="isAuthenticated">
          <NuxtLink to="/editor" class="text-blue-600 hover:underline">
            Editor
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useGithubAuth } from '~/composables/useGithubAuth'

const { isAuthenticated, initiateLogin } = useGithubAuth()

const login = () => {
  initiateLogin()
}
</script>
