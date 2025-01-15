export default defineNuxtConfig({
  // Keep only essential modules first
  modules: [
    "@nuxt/ui", // Let's start with just this one
  ],

  // Essential Nitro config
  nitro: {
    preset: "vercel",
  },
});
