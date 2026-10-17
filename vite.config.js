import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import production from './config/production.json' with { type: 'json' }
import { productionUrl } from './src/qr.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const url = productionUrl(env.VITE_PUBLIC_URL?.trim()) || productionUrl(production.publicUrl)
  return {
    plugins: [vue(), tailwindcss(), {
      name: 'pure-seo',
      transformIndexHtml: { order: 'pre', handler: html => html.replaceAll('%PUBLIC_SITE_URL%', url) },
      writeBundle(options) {
        const directory = resolve(options.dir || 'dist')
        const html = readFileSync(resolve(directory, 'index.html'), 'utf8')
        writeFileSync(resolve(directory, 'studio.html'), html.replace('content="index, follow"', 'content="noindex, nofollow"').replace('<title>PURE — Instagram & WhatsApp</title>', '<title>PURE — Print Studio</title>'))
        writeFileSync(resolve(directory, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /studio\nSitemap: ${url}sitemap.xml\n`)
        writeFileSync(resolve(directory, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url}</loc></url></urlset>`)
      }
    }]
  }
})
