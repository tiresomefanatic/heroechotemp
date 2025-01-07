// nuxt.config.ts
export default defineNuxtConfig({
  // Essential modules that your application needs
  modules: [
    "@nuxt/content", // Handles your markdown content
    "@nuxt/ui", // Provides UI components
    "@nuxtjs/tailwindcss", // CSS framework
  ],

  // Content module configuration - this handles your documentation
  content: {
    // Enable Markdown navigation features
    navigation: {
      fields: ["navigation"],
    },
    // Better markdown handling
    markdown: {
      // Table of contents configuration
      toc: {
        depth: 3,
        searchDepth: 3,
      },
      // Useful plugins for documentation
      remarkPlugins: [
        "remark-github", // Handles GitHub-flavored markdown
      ],
      rehypePlugins: [
        "rehype-slug", // Adds IDs to headings
        "rehype-autolink-headings", // Makes headings clickable
      ],
    },
  },

  // Configuration that changes based on environment
  runtimeConfig: {
    github: {
      clientId: process.env.NUXT_GITHUB_CLIENT_ID,
      clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
    },
    public: {
      githubClientId: process.env.NUXT_PUBLIC_GITHUB_CLIENT_ID,
      siteUrl:
        process.env.NUXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"),
    },
  },

  // Vercel deployment configuration
  nitro: {
    preset: "vercel",
    prerender: {
      crawlLinks: true,
      routes: ["/", "/design", "/design/foundation"],
    },
  },

  // Route-specific behavior
  routeRules: {
    // Static homepage
    "/": { prerender: true },
    // Documentation pages
    "/design/**": {
      ssr: true,
      prerender: true,
    },
    // API endpoints
    "/api/**": {
      cors: true,
      headers: {
        "access-control-allow-methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "access-control-allow-origin": "*",
      },
    },
  },
});
