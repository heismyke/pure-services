import QRCode from 'qrcode'
export const SOCIAL = Object.freeze({ instagram: 'https://www.instagram.com/shoppure.ng?srtk=MXY2azQxMnVxNTY3dQ%3D%3D&utm_source=qr', whatsapp: 'https://wa.me/message/CLYEIEAXYK35C1' })
export function productionUrl(value) {
  try {
    const u = new URL(value)
    const h = u.hostname.toLowerCase()
    if (u.protocol !== 'https:' || u.username || u.password || u.hash || u.search || u.pathname !== '/' || !h.includes('.') || h.includes(':') || /^\d+\./.test(h) || /(^|\.)(localhost|local|internal|test|invalid|example)$/.test(h) || /(^|\.)(example\.(com|org|net)|your-deployed-domain\.com)$/.test(h) || h.endsWith('.localhost')) return ''
    return u.href
  } catch { return '' }
}
export function qrGeometry(url) {
  if (!productionUrl(url)) throw new Error('Configure a permanent public HTTPS root URL before generating a QR code.')
  const { modules } = QRCode.create(url, { errorCorrectionLevel: 'H' })
  const size = modules.size + 8
  let path = ''
  for (let y = 0; y < modules.size; y++) for (let x = 0; x < modules.size; x++) if (modules.get(y, x)) path += `M${x + 4} ${y + 4}h1v1h-1z`
  return { size, path }
}
export function cardSvg(url, logo) {
  const { size, path } = qrGeometry(url)
  // Logo stays above the QR to preserve every module and the four-module quiet zone.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100mm" height="140mm" viewBox="0 0 1000 1400"><rect width="1000" height="1400" fill="#f5f1e9"/><rect x="35" y="35" width="930" height="1330" rx="2" fill="none" stroke="#cec5b5"/><circle cx="500" cy="235" r="135" fill="#253c30"/><image href="${logo}" x="405" y="120" width="190" height="230" preserveAspectRatio="xMidYMid meet"/><path d="M445 410h110" stroke="#9b927e"/><svg x="170" y="465" width="660" height="660" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="#fff"/><path d="${path}" fill="#18251f"/></svg><text x="500" y="1220" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="27" letter-spacing="6" fill="#242820">SCAN TO CONNECT</text><text x="500" y="1285" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="25" fill="#6b685e">Instagram • WhatsApp</text></svg>`
}
export async function loadLogo(path) {
  const response = await fetch(path)
  if (!response.ok) throw new Error('The original PURE lotus logo has not been added.')
  const blob = await response.blob()
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(blob.type)) throw new Error('Use the original logo as a PNG, JPEG or WebP image.')
  const data = await new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = reject; r.readAsDataURL(blob) })
  const img = new Image(); img.src = data; await img.decode()
  return data
}
export function download(blob, name) {
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export async function exportCard(svg, format) {
  if (format === 'svg') return download(new Blob([svg], { type: 'image/svg+xml' }), 'PURE-connect.svg')
  if (format === 'pdf') {
    const [{ jsPDF }, { svg2pdf }] = await Promise.all([import('jspdf'), import('svg2pdf.js')])
    const doc = new jsPDF({ unit: 'mm', format: [100, 140] })
    const element = new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement
    await svg2pdf(element, doc, { x: 0, y: 0, width: 100, height: 140 })
    return doc.save('PURE-connect.pdf')
  }
  const img = new Image(); const object = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  try {
    img.src = object; await img.decode()
    const c = document.createElement('canvas'); c.width = 2000; c.height = 2800
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
    const blob = await new Promise(resolve => c.toBlob(resolve, 'image/png'))
    if (!blob) throw new Error('PNG export failed. Please retry.')
    download(blob, 'PURE-connect.png')
  } finally { URL.revokeObjectURL(object) }
}
