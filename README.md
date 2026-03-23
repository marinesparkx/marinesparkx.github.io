# Marine Spark X — Landing Page

Landing page for [Marine Spark X](https://www.marinesparkx.com), built with Astro + Tailwind CSS.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/marinesparkx/landing)

## Stack

- **Framework**: [Astro](https://astro.build) (static, zero JS by default)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Icons**: [astro-icon](https://github.com/natemoo-re/astro-icon) + Lucide / MDI
- **Analytics**: [Umami Cloud](https://cloud.umami.is) (free, cookieless, GDPR-compliant)
- **Hosting**: GitHub Pages (auto-deploy on push to `main`)

## Edit in Browser

No local dev setup needed. Open in StackBlitz or bolt.new:

- **StackBlitz**: [stackblitz.com/fork/github/marinesparkx/landing](https://stackblitz.com/fork/github/marinesparkx/landing)
- **bolt.new**: [bolt.new/github.com/marinesparkx/landing](https://bolt.new/github.com/marinesparkx/landing)
- **Quick file edit**: Replace `github.com` with `pr.new` in any file URL to edit and submit a PR

Push to `main` and the site auto-deploys via GitHub Actions.

## Local Development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # Build to dist/
npm run preview    # Preview built site
```

**Format & check:**
```bash
npx prettier --write "src/**/*.{astro,css,js,mjs}"
npx astro check
```

## Deploy (GitHub Pages)

Handled automatically by `.github/workflows/deploy.yml` on push to `main`.

**Setup (one-time):**
1. Go to repo **Settings > Pages**
2. Set **Source** to **GitHub Actions**
3. Push to `main`

**Custom domain:**
1. Add domain in repo Settings > Pages > Custom domain
2. Update `site` in `astro.config.mjs`
3. DNS: CNAME record pointing to `<username>.github.io`

## Analytics (Umami)

Using [Umami Cloud](https://cloud.umami.is) free tier (100K events/month, 3 websites, EU data region).

**Setup:**
1. Sign up at [cloud.umami.is/signup](https://cloud.umami.is/signup)
2. Select EU data region
3. Add website, copy the `data-website-id`
4. Update the script tag in `src/pages/index.astro` `<head>`:

```html
<script
  defer
  src="https://cloud.umami.is/script.js"
  data-website-id="YOUR-ID-HERE"
  data-domains="marinesparkx.com,www.marinesparkx.com"
></script>
```

**Track button clicks** by adding `data-umami-event` to any element:
```html
<a href="#contact" data-umami-event="CTA Get Involved">Get involved</a>
```

No cookies. No consent banner needed. `data-domains` prevents tracking on localhost/staging.

## Project Structure

```
src/
  assets/images/   # Optimized images (processed by Astro)
  pages/
    index.astro    # Landing page
  styles/
    global.css     # Tailwind + custom theme
public/            # Static assets (favicon, CNAME)
astro.config.mjs   # Astro + Tailwind + astro-icon config
```
