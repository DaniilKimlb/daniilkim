import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import image from '@astrojs/image'
import compress from 'astro-compress'
import vercel from '@astrojs/vercel/serverless'

export default defineConfig({
  site: 'https://daniilkim.me/',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  integrations: [
    tailwind({ config: { applyBaseStyles: false } }),
    sitemap(),
    image({ serviceEntryPoint: '@astrojs/image/sharp' }),
    compress({ img: false }),
  ],
})
