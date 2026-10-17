<script setup>
import { ref, onMounted } from 'vue'
import { Instagram, MessageCircle, ArrowUpRight, ArrowLeft, Download, Copy, Check, ExternalLink } from 'lucide-vue-next'
import { SOCIAL, productionUrl, loadLogo, cardSvg, exportCard } from './qr'
import production from '../config/production.json'
const studio = location.pathname.replace(/\/$/, '') === '/studio'
const logoPath = import.meta.env.VITE_LOGO_URL || '/brand/pure-lotus.png'
const url = productionUrl(import.meta.env.VITE_PUBLIC_URL?.trim()) || productionUrl(production.publicUrl)
const logo = ref(''), svg = ref(''), loading = ref(true), error = ref(''), busy = ref(''), copied = ref(false), confirmed = ref(false)
onMounted(async () => {
  try { logo.value = await loadLogo(logoPath); if (url) svg.value = cardSvg(url, logo.value) }
  catch (e) { if (studio) error.value = e.message }
  finally { loading.value = false }
})
async function save(format) {
  busy.value = format; error.value = ''
  try { await exportCard(svg.value, format) } catch(e) { error.value = e.message || 'Export failed. Please try again.' }
  finally { busy.value = '' }
}
async function copy() {
  try { await navigator.clipboard.writeText(url); copied.value = true; setTimeout(() => copied.value = false, 2500) }
  catch { error.value = 'Could not copy. Select and copy the destination URL below.' }
}
</script>

<template>
  <div v-if="!studio" class="landing">
    <main class="connect">
      <div class="brand-emblem" v-if="logo"><img :src="logo" alt="PURE lotus" width="112" height="130"></div>
      <div class="fine-rule"></div>
      <h1 class="connect-heading">Connect with us.</h1>
      <p class="intro">A little closer, wherever you are.</p>
      <nav class="social-links" aria-label="Connect with PURE">
        <a :href="SOCIAL.instagram" target="_blank" rel="noopener noreferrer" class="social-link"><span class="icon-box"><Instagram :size="23" :stroke-width="1.5" /></span><span><small>OUR EVERYDAY</small><strong>Follow us on Instagram</strong></span><ArrowUpRight class="link-arrow" :size="21" :stroke-width="1.4" /></a>
        <a :href="SOCIAL.whatsapp" target="_blank" rel="noopener noreferrer" class="social-link whatsapp"><span class="icon-box"><MessageCircle :size="23" :stroke-width="1.5" /></span><span><small>LET’S TALK</small><strong>Chat with us on WhatsApp</strong></span><ArrowUpRight class="link-arrow" :size="21" :stroke-width="1.4" /></a>
      </nav>
      <p class="closing">We’re happy you’re here.</p>
    </main>
    <footer class="landing-footer"><span>PURE</span><span>STAY CONNECTED.</span></footer>
  </div>

  <div v-else class="studio">
    <header class="studio-header"><span>THE PRINT STUDIO</span><a href="/" class="back-link"><ArrowLeft :size="16"/> Landing page</a></header>
    <main class="studio-grid">
      <section class="studio-controls">
        <span class="eyebrow">ONE CODE. TWO CONNECTIONS.</span><h1>A beautiful<br>way to connect.</h1><p class="studio-intro">Your PURE connection card, ready for the real world.</p>
        <div class="setting"><span class="step">01</span><div><h2>The destination</h2><p>Every scan opens your public PURE landing page.</p><div v-if="url" class="url-row"><code>{{ url }}</code><button @click="copy" :aria-label="copied ? 'URL copied' : 'Copy public URL'"><Check v-if="copied" :size="17"/><Copy v-else :size="17"/></button></div><p v-else class="notice">Set VITE_PUBLIC_URL to your permanent public HTTPS root URL, then rebuild. QR generation is paused.</p><a v-if="url" :href="url" target="_blank" rel="noopener noreferrer" class="text-link">Open and verify destination <ExternalLink :size="14"/></a></div></div>
        <div class="setting"><span class="step">02</span><div><h2>Made for print</h2><p>100 × 140 mm · warm ivory · vector QR<br>The lotus sits above the code for a clear scan.</p><label class="confirmation"><input type="checkbox" v-model="confirmed" :disabled="!svg">I opened the destination and confirmed it is public and correct.</label><div class="downloads"><button v-for="format in ['png','svg','pdf']" :key="format" :disabled="!svg || !confirmed || !!busy" @click="save(format)"><Download :size="16"/>{{ busy === format ? 'Saving…' : format.toUpperCase() }}</button></div><p class="export-note">PNG: 2000 × 2800 px · PDF & SVG: vector artwork</p></div></div>
        <p v-if="loading" role="status">Preparing your card…</p><p v-if="error" role="alert" class="notice">{{ error }}</p>
        <p class="studio-footnote">Print at 100% scale. Test a printed proof with iPhone Camera and an Android QR reader before ordering a batch.</p>
      </section>
      <section class="preview-area" aria-label="Printable card preview"><div v-if="svg" class="print-preview" v-html="svg"></div><div v-else class="empty-card"><img v-if="logo" :src="logo" alt="PURE lotus"><span v-if="!logo" class="preview-wordmark">PURE</span><div class="qr-placeholder"><span>YOUR QR<br>GOES HERE</span></div><strong>SCAN TO CONNECT</strong><p>Instagram · WhatsApp</p><span class="draft-label">PREVIEW · SETUP REQUIRED</span></div><p class="preview-caption">THE CONNECTION CARD <span>100 × 140 MM</span></p><a href="/" target="_blank" rel="noopener" class="text-link">Preview the landing page <ArrowUpRight :size="16"/></a></section>
    </main>
  </div>
</template>
