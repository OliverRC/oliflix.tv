// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', "shadcn-nuxt", 'nuxt-svgo', "@nuxt/content"],
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'en', class: 'dark' },
      link: [{ rel: 'stylesheet', href: 'https://kit.fontawesome.com/c2ef00ba70.css' }]
    }
  },
  components: {
         global: true,
         dirs: ['~/components']
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  }
})