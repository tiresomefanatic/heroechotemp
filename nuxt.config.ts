// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/styles/main.css"],
  devtools: { enabled: true },

  modules: [
    "@nuxt/content",
    "@nuxt/ui",
    "@nuxtjs/tailwindcss"
  ],

  // Add runtime config for GitHub
  runtimeConfig: {
    github: {
      clientId: process.env.NUXT_GITHUB_CLIENT_ID,
      clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
    },
    public: {
      githubClientId: process.env.NUXT_PUBLIC_GITHUB_CLIENT_ID,
      siteUrl: process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000',
    },
  },

  // Configure app
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  // Configure Nitro for Vercel
  nitro: {
    preset: 'vercel',
    routeRules: {
      "/api/**": {
        cors: true,
        headers: {
          "access-control-allow-methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
          "access-control-allow-origin": "*"
        }
      }
    }
  },

  compatibilityDate: "2025-01-06"
})