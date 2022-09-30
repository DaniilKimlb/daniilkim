import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import image from '@astrojs/image'
import compress from 'astro-compress'

export default defineConfig({
  site: 'https://daniilkim.me/',
  integrations: [
    tailwind({ config: { applyBaseStyles: false } }),
    sitemap(),
    image({ serviceEntryPoint: '@astrojs/image/sharp' }),
    compress({ img: false }),
  ],
})
