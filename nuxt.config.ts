// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/styles/main.css"],
  modules: ["@nuxt/content"],

  content: {
    documentDriven: false,
    markdown: {
      anchorLinks: false,
      tags: {
        p: 'p',
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4'
      }
    }
  },

  compatibilityDate: '2025-01-02'
})