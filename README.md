# pure-services

PURE — Connect

A small Vue 3 / Vite / Tailwind application with a customer landing page at `/` and a public, backend-free design studio at `/studio`. Icons are Lucide. QR generation uses `qrcode` with high (H) error correction. No customer data is collected and no login is required.

## Current handoff status

The original PURE logo is included unchanged at `public/brand/pure-lotus.png`, preserving its proportions and signature. A forest backing gives its ivory artwork contrast. The event flyer remains unavailable; matching that reference requires the original flyer. The studio blocks QR generation/export when the logo or production URL is missing.

Dependencies are installed, and `npm run build` and `npm test` pass. Browser, downloaded-file and real-device checks have not been completed. Social links match those provided; earlier live requests were blocked by DNS. No site has been deployed and no final production QR has been generated.

## Local development

Use Node 22.12+ and npm.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open the URL Vite prints. Open `/studio` for the print studio. Run `npm test` for destination validation, supplied-link assertions, and QR render/decode tests. Run `npm run build` for production and `npm run preview` to inspect the build.

Add the supplied lotus PNG (preferably transparent, at least 600px wide) to `public/brand/pure-lotus.png`, or set `VITE_LOGO_URL` to another same-origin original PNG/JPEG/WebP path. Aspect ratios are preserved in both page and print artwork. Raster logo formats intentionally avoid unsupported SVG contents; all QR modules, card text, rules and backgrounds remain vector in SVG/PDF. Do not replace the brand asset with a generated lotus. Review the final colors and typography against the supplied flyer when available.

Set `VITE_PUBLIC_URL` to the **permanent public HTTPS root landing URL**, including trailing slash. Leave it blank until the real domain is known. Localhost, IP literals, reserved domains, example domains, query strings, fragments and non-root paths are rejected. A valid format does not prove a site is deployed: open the destination from the studio and verify it loads without authentication, including in a private browser window. Vite embeds these variables at build time; rebuild/redeploy after changing them. Do not put secrets in VITE variables.

## Deploy to Cloudflare Pages (preferred)

1. Push this project directory to your Git repository. In Cloudflare **Workers & Pages**, create a **Pages** project and connect the repository. If the repository contains other projects, set the root directory to this project's folder.
2. Use build command `npm run build`, build output directory `dist`, and Node 22.12 or later (`NODE_VERSION=22` in build variables).
3. Add the original logo at `public/brand/pure-lotus.png`. Set `VITE_LOGO_URL` if the asset path differs.
4. Deploy once to obtain your stable project `pages.dev` address, or configure your permanent custom domain. Set the **Production build environment variable** `VITE_PUBLIC_URL` to that exact public HTTPS root URL, ending in `/`, then trigger a new production deployment. Do not use a branch or per-deployment preview URL for printed codes. Do not automatically derive the printable URL from `CF_PAGES_URL`.
5. Open the live `/studio` page. Check that the destination is public without Cloudflare Access or another login, verify its URL, confirm the checkbox, and download PNG, SVG or PDF. The logo and configured URL are required before exports unlock.

`public/_redirects` serves the app for `/studio` and `/studio/`; `public/_headers` adds basic security headers. Vite copies both to `dist`. No Worker, backend, database or Cloudflare bindings are needed. Environment variables are embedded at build time, so changing them requires a new build. Nothing has been deployed to your Cloudflare account by this project.

Cloudflare reference: [Vue on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vue-site/), [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), and [redirects](https://developers.cloudflare.com/pages/configuration/redirects/).

## Deploy to Vercel

1. Push this directory to a Git repository and import it in Vercel. Choose **Vite**, build command `npm run build`, output directory `dist`.
2. Add the original logo before publishing the final design. Set `VITE_LOGO_URL` if its path differs from the default.
3. Deploy the landing page, choose its permanent public domain, then set **Production** environment variable `VITE_PUBLIC_URL=https://YOUR-REAL-DOMAIN/` in project settings. Use the actual domain, never the literal example. Redeploy to bake it into the client.
4. Ensure the production page is publicly accessible without Vercel deployment protection. `/studio` is intentionally public; it contains no secrets and can be opened directly thanks to `vercel.json`.
5. Open `/studio`, verify the displayed destination, use the **Open and verify destination** link, confirm the checkbox, then export.

Reference: [Vercel Vite deployment](https://vercel.com/docs/frameworks/frontend/vite) and [environment variables](https://vercel.com/docs/environment-variables). No Vercel account actions have been performed by this project.

## Print artwork

There is exactly one QR destination: the configured landing page. Instagram and WhatsApp remain links on that page. The original lotus appears **above** the QR as the conservative scanning fallback. The QR uses dark green modules on white, H error correction and an uninterrupted four-module quiet zone.

- SVG: self-contained original logo plus vector card, physical size 100 × 140 mm.
- PDF: 100 × 140 mm, vector QR/text generated through svg2pdf and jsPDF, original embedded logo.
- PNG: 2000 × 2800 pixels, approximately 508ppi at the intended physical size. Set physical print size explicitly; the image does not promise embedded DPI metadata.

The card is trim-size, with an inset border and no bleed or crop marks. Ask a professional printer to add bleed when their workflow requires it. For a sticker or business card, resize uniformly and keep the QR including quiet zone at least 30mm wide. The layout is portrait; a landscape business card requires a separate layout. Always test at the actual final size and stock.

## Release checks

- Install dependencies; commit the resulting package-lock.json for reproducible installs, then use `npm ci` in CI.
- Run `npm test` and `npm run build`.
- Check `/` and `/studio` at 320px, 390px, tablet and desktop widths; keyboard navigation and reduced motion.
- Confirm both social links reach the correct business profile/chat on real devices. External links use `noopener noreferrer`.
- Download all three formats; open SVG in a browser and PDF in a PDF viewer. Confirm PNG dimensions, PDF page size, original logo proportions and no clipped content.
- Decode each downloaded QR and confirm the exact configured destination. The included automated decoder test checks the QR geometry, not actual browser-generated PDF/PNG exports.
- Print at 100%; scan using iPhone Camera, Android Camera/Google Lens and another independent reader. Test realistic lighting and viewing distances.
- Confirm the final destination has valid HTTPS and no login requirement. Keep the domain active after printing. Updating social links does not require reprinting if the landing URL remains the same.

Automated decoding cannot replace physical mobile-reader checks. No real-device scannability claim is made until these checks are completed.
