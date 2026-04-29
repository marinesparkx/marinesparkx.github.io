# Marine Spark X Landing — Working Notes

This file is loaded by Claude Code automatically. It captures conventions established when this project was built so future changes stay consistent.

## Stack

- **Astro 6** (static output, zero JS by default)
- **Tailwind CSS 4** (via `@tailwindcss/vite`, `@theme` in `src/styles/global.css`)
- **astro-icon** with Lucide + MDI icon sets
- **Umami Cloud** analytics (env-gated via `PUBLIC_UMAMI_ID`)
- **GitHub Pages** deploy via `withastro/action@v5`

## Work With the Grain

These are the patterns Astro and Tailwind 4 are designed for. Don't fight them.

### Frontmatter ordering (build gotcha)

ESM strict ordering — **all `import` statements must come before any other code** in the `---` frontmatter block. esbuild fails with cryptic `Unterminated string literal` errors otherwise.

```astro
---
import "../styles/global.css";
import { Image } from "astro:assets";
import logo from "../assets/images/logo.png";
// All imports above ↑

const myVar = import.meta.env.PUBLIC_FOO;  // const after imports
---
```

### Images — always use `<Image>`

```astro
import { Image } from "astro:assets";
import hero from "../assets/images/hero.jpeg";

<Image src={hero} alt="..." widths={[768, 1024, 1440, 1920]} class="..." />
```

- Auto-converts to WebP, generates `srcset`, lazy-loads
- Build-time optimization (sea urchin PNG: 1128kB → 70kB)
- Use `widths={[...]}` for responsive variants
- Put images in `src/assets/images/`, **not** `public/` (so they're processed)

### Icons — astro-icon, not raw SVG

```astro
import { Icon } from "astro-icon/components";

<Icon name="lucide:flask-conical" class="w-8 h-8 text-teal-400" />
<Icon name="mdi:linkedin" class="w-5 h-5" />
```

Available icon sets in this project: `@iconify-json/lucide`, `@iconify-json/mdi`. Add more sets only if needed.

### Scripts in templates

- **Default `<script>`**: processed by esbuild as TS/ESM, bundled, hoisted, deduped
- **`<script is:inline>`**: rendered as-is, no processing, allows external `src` (analytics, CDN scripts)

```astro
<!-- External: needs is:inline -->
<script is:inline defer src="https://cloud.umami.is/script.js" data-website-id={id}></script>

<!-- Inline behavior: plain script, gets bundled -->
<script>
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
</script>
```

### Tailwind 4 — `@theme` not config file

Define design tokens in `src/styles/global.css` with the `@theme` directive. CSS variables prefixed `--color-*` automatically generate utility classes.

```css
@import "tailwindcss";

@theme {
  --font-display: "Cormorant Garamond", serif;
  --font-body: "DM Sans", sans-serif;
  --color-ocean-50: #e8f4f8;
  /* ... */
  --color-ocean-950: #040f17;
}
```

This generates `bg-ocean-950`, `text-ocean-300`, `border-ocean-800/50`, etc.

### Env vars — `PUBLIC_` prefix only for client

```astro
const id = import.meta.env.PUBLIC_UMAMI_ID;
{id && <script ... data-website-id={id}></script>}
```

Vars without `PUBLIC_` are server-only (build-time). Public values appear in HTML, so don't put secrets there.

## Design System

### Aesthetic direction

**Ocean / Nordic editorial**. Deep navy backgrounds, teal accents, refined typography, atmospheric layered backgrounds. Avoid AI-slop tells:
- ❌ Purple gradients on white
- ❌ Inter / Roboto / system-ui
- ❌ Symmetric centered-everything layouts
- ❌ Cookie-cutter "feature card grid" without character

### Typography

- **Display**: Cormorant Garamond (serif, weight 300 default, italic for emphasis)
- **Body**: DM Sans (geometric sans, weights 300-700)
- **Tracking**: `tracking-[0.3em] uppercase` for kicker labels
- **Scale jumps**: extreme — `text-5xl md:text-7xl lg:text-8xl` for hero, `text-sm` for kickers

### Color palette

- `bg-ocean-950` — body
- `bg-ocean-900/50` — cards
- `text-ocean-100` — body text
- `text-ocean-300` — secondary
- `text-ocean-400` — muted
- `text-teal-400` — kickers/accents
- `text-teal-300` — links/CTAs
- `border-ocean-800/50` — subtle borders

### Layout patterns

**Section wrapper:**
```astro
<section id="..." class="py-28 md:py-36 relative">
  <div class="absolute inset-0 bg-[radial-gradient(...)]"></div>
  <div class="relative max-w-7xl mx-auto px-6">
    <!-- content -->
  </div>
</section>
```

**Reveal animation:** add `class="reveal"` with optional `style="transition-delay: 0.15s"`. The IntersectionObserver in `<script>` handles the rest.

**Decorative offset boxes:** `<div class="absolute -bottom-6 -left-6 w-32 h-32 border border-teal-500/20 rounded-sm"></div>` next to images.

### Mobile nav quirks

- Background must appear **instantly** when hamburger opens (no transition flash)
- Background must **smooth-fade** when scrolling past 50px
- Pattern: temporarily set `nav.style.transition = "none"` on toggle, restore via `requestAnimationFrame`
- Border: keep `border-b border-transparent` permanent, transition `border-color` only (avoids white flash on first scroll)

## Conventions

- One commit per logical change. Squash fix commits before pushing.
- Commit messages: imperative, single line, no co-authored-by trailer.
- Prettier formats `.astro/.css/.js/.mjs`. Run `npx prettier --write "src/**/*.{astro,css,js,mjs}"` before committing.
- `npx astro check` must pass (0 errors, 0 warnings).
- `npm run build` must complete locally before pushing — GitHub Actions will fail otherwise.

## Reference Docs (local)

When writing new code, consult these before guessing:

- `~/.local/share/resources/github.com/withastro/docs/tree/HEAD/src/content/docs/en/` — Astro guides & references
- `~/.local/share/resources/github.com/withastro/astro/tree/HEAD/` — Astro source (look at `examples/` for patterns)
- `~/.local/share/resources/github.com/tailwindlabs/tailwindcss.com/tree/HEAD/` — Tailwind 4 docs
- `~/.local/share/resources/github.com/vitejs/vite/tree/HEAD/` — Vite (Astro's build tool)
- `~/.local/share/resources/github.com/umami-software/docs/tree/HEAD/` — Umami analytics
- `~/.local/share/resources/github.com/lucide-icons/lucide/tree/HEAD/` — Icon names

Prefer reading these over guessing or web-searching.

## Don't

- Don't add raw SVGs inline — use `<Icon>` from astro-icon.
- Don't put images in `public/` for content — use `src/assets/` so they're optimized.
- Don't add `is:inline` to local scripts — they get bundled, that's the point.
- Don't add libraries without a strong reason. Astro's defaults + Tailwind cover almost everything.
- Don't introduce new fonts without a deliberate reason. Stick with Cormorant Garamond + DM Sans.
- Don't write JSDoc/comments explaining what code does — well-named identifiers do that.
- Don't hardcode `data-website-id` for Umami — use the `PUBLIC_UMAMI_ID` env var pattern.
