import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Resvg } from '@resvg/resvg-js'
import jsQR from 'jsqr'
import { productionUrl, qrGeometry, cardSvg, SOCIAL } from '../src/qr.js'

test('production URL rejects unsafe or placeholder destinations', () => {
  for (const url of ['', 'http://pure.ng/', 'https://localhost/', 'https://127.0.0.1/', 'https://example.com/', 'https://your-deployed-domain.com/', 'https://pure.ng/studio', 'https://pure.ng/#studio', 'https://user:pass@pure.ng/', 'https://pure.local/']) assert.equal(productionUrl(url), '', url)
  assert.equal(productionUrl('https://pure.ng'), 'https://pure.ng/')
})
test('QR geometry decodes to exactly the production URL with four-module margins', () => {
  for (const url of ['https://pure.ng/', 'https://a-long-permanent-business-domain.ng/']) {
    const { size, path } = qrGeometry(url)
    const result = new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="white"/><path d="${path}" fill="#18251f"/></svg>`).render()
    const decoded = jsQR(new Uint8ClampedArray(result.pixels), result.width, result.height)
    assert.equal(decoded?.data, url)
    assert.ok(path.startsWith('M4 4'))
  }
})
test('branded SVG preserves physical size and embeds supplied image', () => {
  const logo = 'data:image/png;base64,TEST'
  const svg = cardSvg('https://pure.ng/', logo)
  assert.ok(svg.includes('width="100mm" height="140mm"'))
  assert.ok(svg.includes(`href="${logo}"`))
  assert.ok(svg.includes('Instagram • WhatsApp'))
  assert.throws(() => cardSvg('http://localhost:5173/', logo))
})
test('social destinations match business-supplied URLs', () => {
  assert.equal(SOCIAL.whatsapp, 'https://wa.me/message/CLYEIEAXYK35C1')
  assert.equal(SOCIAL.instagram, 'https://www.instagram.com/shoppure.ng?srtk=MXY2azQxMnVxNTY3dQ%3D%3D&utm_source=qr')
})
