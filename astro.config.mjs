import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import compress from 'astro-compress'
import vercel from '@astrojs/vercel/serverless'
import svelte from '@astrojs/svelte'

export default defineConfig({
  site: 'https://daniilkim.me/',
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  integrations: [
    svelte(),
    tailwind({ config: { applyBaseStyles: false } }),
    sitemap(),
    compress({ img: false }),
  ],
})
