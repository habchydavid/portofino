# Portofino — beachfront Italian, Jounieh Old Souk

Marketing site for Portofino: Next.js (App Router) + TypeScript + Tailwind CSS,
built as a **static export**. No backend, no database, no API keys. `npm run
build` produces a folder of files you can host anywhere.

> **This is a placeholder build.** Photography, prices, guest quotes, the
> restaurant's history and the contact details are all stand-ins, and every one
> of them is marked `TODO` in the source. [What to replace before
> launch](#what-to-replace-before-launch) lists them in one place.

---

## Run it

Requires Node 20 or newer (built and tested on Node 22).

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Static export into `out/` |
| `npm run preview` | Serve `out/` locally, exactly as a host would |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run placeholders` | Regenerate the placeholder artwork in `public/images` |

## Deploy

`npm run build` writes a complete static site to `out/`. Nothing in it needs a
Node server.

**GitHub Pages** (what this repository is set up for) —
`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
Pages serves a project site from a sub-path, so the workflow sets
`NEXT_PUBLIC_BASE_PATH` to `/<repo>` and `NEXT_PUBLIC_SITE_URL` to the full
Pages URL; the first run enables Pages itself. Nothing to configure by hand.

**Vercel** — import the repository. Framework preset: Next.js; the build
command and output directory come from `vercel.json`. Leave
`NEXT_PUBLIC_BASE_PATH` unset and point `NEXT_PUBLIC_SITE_URL` at your domain.

**Netlify** — import the repository. `netlify.toml` supplies the build command
(`npm run build`), the publish directory (`out`), cache headers and a small set
of security headers. Same two environment variables as Vercel.

**Anything else** (S3, Cloudflare Pages, a plain web server) — upload the
contents of `out/`. Two things to check on the host:

- **Serve `.html` for extensionless paths.** Every route is exported as
  `<route>/index.html` and `trailingSlash: true` keeps the links pointing at
  directories, so most hosts do the right thing without configuration.
- **Turn on compression.** The site ships ~103 kB of gzipped JavaScript; served
  uncompressed that is roughly three times the bytes and it shows in the
  performance score. Vercel, Netlify and Cloudflare do this by default.

### Serving from a sub-path

Two environment variables, both read at build time:

| Variable | Default | Set it to |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | empty | `/portofino` on a Pages project site; leave empty on a domain of its own |
| `NEXT_PUBLIC_SITE_URL` | the production domain in `site.ts` | wherever the site actually lives, including any sub-path |

`NEXT_PUBLIC_SITE_URL` is what canonical URLs, Open Graph tags, `sitemap.xml`,
`robots.txt` and the JSON-LD `@id` are built from, so a wrong value here is an
SEO problem rather than a visible one. When you move to the real domain, set it
there and change the fallback in `src/content/site.ts` to match.

Note that `next/image` does **not** apply `basePath` when images are
unoptimized, which is the case for a static export — so images go through
`src/components/SiteImage.tsx`, which applies it. Use that component rather
than importing `next/image` directly, or the image will 404 on a sub-path
deploy.

---

## Where the content lives

Editing the site means editing data files, not components. Nothing in
`src/components` hard-codes a price, a phone number or a sentence of copy.

| File | Holds |
| --- | --- |
| `src/content/site.ts` | Name, phone, WhatsApp number, email, address, map pin, hours, live-music nights, social links, SEO defaults |
| `src/content/menu.json` | The entire menu: categories, dishes, descriptions, prices, dietary tags |
| `src/content/gallery.json` | The gallery images and their alt text |
| `src/content/i18n/en.json` | Every word of UI and page copy, English |
| `src/content/i18n/fr.json` | The same, French |

### Updating the menu

`src/content/menu.json` is the only file to touch. A dish looks like this:

```jsonc
{
  "name": "Spaghetti alle Vongole",
  "description": "Clams, white wine, garlic, a whisper of chilli.",
  "price": 26,              // plain number; `null` + "priceNote" for market price
  "tags": ["V", "GF"],      // keys from "tagLegend" at the top of the file
  "signature": true         // optional; prints a small SIGNATURE label
}
```

Add, remove or reorder categories in the `categories` array — the page's
anchored navigation, the jump links and the print layout all follow the file.
A category `id` becomes its URL anchor (`/menu/#pasta`), so changing an `id`
breaks any link that pointed at it.

### Changing prices

Edit the numbers in `menu.json`, rebuild, redeploy. `currency` and
`currencySymbol` at the top of the file control formatting everywhere.

---

## Images

Everything in `public/images` is generated placeholder artwork, labelled
**PLACEHOLDER** on the image itself so a stand-in cannot quietly ship. They are
SVGs; real photographs will be `.jpg` or `.webp`.

To swap one in:

1. Drop the photograph into `public/images`.
2. Point at it — gallery images in `src/content/gallery.json`, everything else
   in the component that renders it (each one carries a `TODO` comment naming
   the shot). Update `width`/`height` to the real pixel dimensions.
3. Write real `alt` text. The gallery uses it for the lightbox caption as well.

Recommended sizes: hero **2400×1350**, dish portraits **1200×1500**, wide
section images **1800×1200**, gallery **~1200–1600px** on the long edge. Export
at around 80% JPEG quality and keep each file under ~300 kB.

`npm run placeholders` regenerates the stand-ins if you need them back;
`scripts/generate-placeholders.mjs` holds the manifest.

> **Static export means `next/image` cannot optimise at request time**
> (`images: { unoptimized: true }` in `next.config.ts`). The component still
> handles layout, `sizes` and lazy loading, but the file you upload is the file
> the visitor downloads — so resize and compress before committing. Large
> unoptimised photography is the one thing most likely to pull the performance
> score down from where it is now.

---

## Reservations, without a backend

`/reservations` validates in the browser and then hands the guest a WhatsApp
message that is already written out — name, phone, email, date, time, party
size and notes — addressed to the number in `site.whatsapp`. Sending it is the
booking request; the page says plainly that nothing is confirmed until the
restaurant replies. A "call us instead" button sits next to the submit button
throughout, and again on the confirmation screen in case the WhatsApp handoff
is blocked.

Validation rules live in `src/lib/reservation.ts`: a name, a plausible phone
number, a valid email *if* one is given, a date that is not in the past, and a
time inside service hours (13:00–01:00, wrapping past midnight — it reads the
hours from `site.ts`, so changing them changes the validation).

If you later want real bookings in a system, replace the submit handler in
`src/components/reservations/ReservationForm.tsx`. Everything else — the fields,
the validation, the error summary — stays as it is.

---

## Languages

English is primary: it is what the exported HTML contains and what search
engines index. French is available from the EN/FR switch in the header, applied
in the browser and remembered in `localStorage`.

Every string comes from `src/content/i18n/*.json`, and the two files are
key-for-key identical. To add a language:

1. Copy `en.json` to, say, `ar.json` and translate the values.
2. Register it in `src/content/i18n/index.ts` (`locales`, `dictionaries`).
3. Add its label to `LOCALE_LABELS` in `src/components/Header.tsx`.

Menu items can be translated too, without touching the dictionaries: add a
`name_fr` or `description_fr` alongside any field in `menu.json` and it is used
when French is showing. Anything untranslated falls back to the base field, so
the menu never breaks half-way through a translation.

**If French needs its own indexed URLs** (`/fr/menu/` and so on), move the
pages under `src/app/[locale]/`, add `generateStaticParams` returning the
locales, and read the locale from the route instead of from context. The
dictionaries and every component that reads them stay exactly as they are.

---

## Accessibility

Audited with axe-core on every page at desktop and mobile widths, including the
open states — mobile navigation, gallery lightbox, and the form showing errors.
**Zero violations.** Lighthouse accessibility scores 100 on all six pages.

What that rests on:

- Semantic structure: one `<h1>` per page, real landmarks, `<address>` for
  addresses, `<dl>` for detail pairs, lists for lists.
- A skip link as the first tab stop, and `:focus-visible` outlines that are
  never removed — a terracotta ring on every interactive element.
- The mobile menu traps focus, closes on `Escape` and returns focus to its
  toggle. The lightbox is a native `<dialog>` opened with `showModal()`, so the
  trap, the inert background and `Escape` come from the platform; arrow keys
  move through the set and focus returns to the thumbnail that opened it.
- The testimonial slider does not autoplay — nothing moves that a reader cannot
  outpace — and announces changes through a live region.
- Form errors appear in a summary that takes focus and links to each field,
  with `aria-invalid` and `aria-describedby` on the controls themselves.
- `prefers-reduced-motion: reduce` disables the scroll animations and smooth
  scrolling entirely.
- Colour pairings meet WCAG AA. The palette is documented at the top of
  `src/app/globals.css`, including which colours are safe for text: terracotta
  `#a24a26` is the one to use for links and buttons, while the lighter
  `#c0643c` and the brass hairlines are decorative only.

**When you replace the hero photograph**, check the headline against it. The
two gradient scrims in `src/components/home/Hero.tsx` are what hold the type at
AA over a bright image — one behind the headline block, one behind the
transparent header. Lighten them only after re-measuring.

## SEO

- Per-page `<title>`, meta description and canonical URL.
- Open Graph and Twitter card tags on every page, with a 1200×630 card
  (`public/images/og-default.png` — **replace with a real photograph**).
- JSON-LD `Restaurant` schema in the root layout: address, geo coordinates,
  opening hours (including the close past midnight), cuisine, price range,
  phone, payment methods, reservation and menu URLs, and social profiles. It is
  generated from `site.ts` in `src/lib/seo.ts`, so it cannot drift from the rest
  of the site. Check changes with Google's Rich Results Test.
- `sitemap.xml` and `robots.txt` are generated at build time from
  `src/app/sitemap.ts` and `src/app/robots.ts`. Add new routes to the first.

## Performance

Lighthouse, mobile emulation, against the static export served with gzip:

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| `/` | 98 | 100 | 100 | 100 |
| `/menu/` | 98 | 100 | 100 | 100 |
| `/about/` | 98 | 100 | 100 | 100 |
| `/gallery/` | 98 | 100 | 100 | 100 |
| `/reservations/` | 98 | 100 | 100 | 100 |
| `/contact/` | 98 | 100 | 100 | 100 |

Reproduce with `npm run build`, then serve `out/` with compression enabled and
point Lighthouse at it (`npx lighthouse http://localhost:3000/ --preset=desktop`
for the desktop run, or the default for mobile). The accessibility audit above
was run with `axe-core` against the same build. Neither tool is a dependency of
the site, so neither is in `package.json`.

Measured with placeholder SVG artwork, which is far lighter than real
photography — expect the performance column to move once real images go in, and
see [Images](#images) for keeping it high. Fonts are self-hosted by `next/font`
(no request to Google at runtime), the map on `/contact` is lazy-loaded, and
content already on screen at load is never faded in, so the animation cannot
delay Largest Contentful Paint.

---

## Printing the menu

`/menu` has its own print stylesheet: navigation, header, footer and the print
button drop out, the page-top spacing collapses, and dishes are kept from
breaking across pages. Sections that have not been scrolled to still print —
the reveal animation never withholds content from the printer.

---

## Project structure

```
portofino/
├── public/images/            Placeholder artwork + the Open Graph card
├── scripts/
│   └── generate-placeholders.mjs
└── src/
    ├── app/
    │   ├── layout.tsx        Fonts, metadata defaults, JSON-LD, chrome
    │   ├── globals.css       The design system: colour, type scale, spacing,
    │   │                     components, motion, print
    │   ├── page.tsx          Home
    │   ├── menu/ about/ gallery/ reservations/ contact/
    │   ├── not-found.tsx
    │   ├── sitemap.ts  robots.ts
    ├── components/
    │   ├── Header.tsx  Footer.tsx  SkipLink.tsx
    │   ├── LocaleProvider.tsx      Locale context + the `useT()` hook
    │   ├── Reveal.tsx              Fade-up on scroll
    │   ├── SectionHeading.tsx      Eyebrow + hairline + display heading
    │   ├── home/                   The seven home-page bands
    │   ├── menu/ about/ gallery/ reservations/ contact/
    ├── content/              Everything editable (see the table above)
    └── lib/
        ├── seo.ts            Page metadata + Restaurant JSON-LD
        ├── menu.ts           Typed view over menu.json
        ├── reservation.ts    Validation + the WhatsApp message
        └── maps.ts           Directions and map-embed URLs
```

### The design system

Defined once, in the `@theme` block at the top of `src/app/globals.css`, and
consumed as Tailwind utilities everywhere else.

- **Colour** — `sand` `#fbf8f3` (ground), `shell` `#f3ece2` (alternating bands),
  `navy` `#14263c` (ink and dark sections), `ink-muted` `#4a5b70` (body),
  `terracotta-deep` `#a24a26` (accent, safe for text), `terracotta` `#c0643c`
  and `brass` `#b08d57` (decorative).
- **Type** — Playfair Display for headings, Inter for body, both self-hosted.
  The scale is fluid: `text-display`, `text-h1`, `text-h2`, `text-h3`,
  `text-lead`, `eyebrow`.
- **Spacing** — `py-section` is the vertical beat between bands and
  `--spacing-gutter` the page gutter; both scale with the viewport, which is
  what keeps the layout airy on a laptop without crushing it on a phone.

---

## What to replace before launch

Search the project for `TODO` — every placeholder is marked. In priority order:

1. **`src/content/site.ts`** — domain, phone, WhatsApp number, email, street
   address, postal code, map pin, social links, payment methods, and which
   nights the musicians actually play.
2. **`src/content/menu.json`** — the whole file. Dishes, descriptions, prices.
3. **`public/images/`** — every photograph, and the Open Graph card.
4. **`src/content/i18n/en.json`** — the history on `/about`, the chef, the
   terrace, and the guest testimonials on the home page (quotes, names and
   sources are invented and must not go live as they are).
5. **`src/content/i18n/fr.json`** — the same content in French, and a native
   speaker's pass over the translation.
6. **`src/content/gallery.json`** — image paths and real alt text.
7. **`public/favicon.svg`** — the restaurant's actual mark.
8. **`src/components/contact/ContactPage.tsx`** — parking guidance.
