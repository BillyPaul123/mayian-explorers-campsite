# Mayian Explorers Campsite — website

A one-page site built from the brief in `docs/`: a welcome poster plus four
story chapters about a Samburu camp 4 km from Samburu National Reserve.

**Design direction:** clean and quiet, wabi-sabi warmth (paper, clay, raw
photography, imperfect hairlines), with Apple-style interaction discipline
(frosted sticky nav, generous type scale, one clear action per screen, motion
that gets out of the way).

## Run it

No build step, no dependencies.

```powershell
# Option A — just open the file
start index.html

# Option B — local server, no dependencies (recommended)
powershell -ExecutionPolicy Bypass -File .\serve.ps1
# then http://127.0.0.1:5173
```

Deploy by uploading the folder to any static host (Netlify, Vercel, Cloudflare
Pages, GitHub Pages, plain nginx).

### Vercel

This is a no-build static site. Import the repo and use:

| Setting | Value |
| --- | --- |
| Framework Preset | `Other` |
| Build Command | *(leave blank)* |
| Output Directory | `.` |
| Install Command | *(leave blank)* |

`vercel.json` sets `cleanUrls`; `.vercelignore` keeps `docs/`, `README.md`,
`CONTENT.md` and `serve.ps1` out of the deployment so only the site is served.

## Structure

```
index.html                 all sections, semantic markup, JSON-LD
assets/css/styles.css      design tokens + components, single stylesheet
assets/js/main.js          nav, mobile menu, reveals, wildlife switcher
assets/img/                emblem.svg + photographs
docs/                      the original incoming images (source of the copy)
CONTENT.md                 extracted copy, mapped to the photos it came from
```

## Sections

1. **Hero** — "Explore the Blessed Land." over the Ewaso Ng'iro
2. **Values strip** — Sustainable · Authentic · Guided by Samburu
3. **Welcome** — the manyatta introduction + key facts
4. **Activities** — bird walks, cultural visits, Mathews Range climbs
5. **The Journey** — the four chapters from the docs, 01–04
6. **Wildlife** — interactive field guide to the Samburu Special Five
7. **Conservation** — the lion keeper / *The Pride of Samburu*
8. **The Camp** — where guests sleep and wake
9. **Book** — both WhatsApp numbers, click-to-chat with prefilled message
10. **Footer** — contact, credits, return to top

## Design tokens

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#F5F0E6` | page base, warm bone |
| `--paper-2` | `#EDE6D7` | cards, alternate bands |
| `--ink` | `#191512` | text, buttons |
| `--clay` | `#A2603C` | accent, links, display italics |
| `--clay-deep` | `#8A4E2E` | eyebrow labels (small text, ≥4.5:1 on paper) |
| `--sand` | `#D8B98C` | accent on dark imagery |
| `--line` | `#DBD2C0` | 1px hairline rules |

Type: **Fraunces** (display, 300 weight, italic for emphasis) + **Inter** (UI
and body). If the webfonts are blocked the fallback stack keeps the same
rhythm (`Iowan Old Style`/Georgia, then system UI).

## Interaction notes

- Nav turns from transparent-on-image to frosted paper after 24 px of scroll.
- Reveals are IntersectionObserver-driven, staggered, and fully disabled under
  `prefers-reduced-motion: reduce`.
- The Special Five list is a real control: hover, click, focus, and ↑/↓ keys
  switch the photograph; `aria-pressed` tracks state.
- Skip link, visible focus rings, 44 px tap targets, semantic landmarks.
- Sticky elements are used sparingly (welcome portrait, wildlife photograph) so
  mobile never traps scroll.

## Before going live

Content was kept faithful to the supplied copy. These still need real inputs:

- [ ] Rates, seasons, and what a stay includes (not in the source material).
- [ ] Exact location / directions and nearest airstrip.
- [ ] Guest capacity, tent count, and any amenities you want to advertise.
- [ ] Real camp photography — the current images are credited Wikimedia
      Commons placeholders and should be swapped for own work.
- [ ] Confirm the WhatsApp numbers and preferred booking flow.
- [ ] Once the production domain is known, make `og:image` / `twitter:image`
      (and add `og:url`) absolute URLs, and add the domain to the JSON-LD.
- [ ] Add analytics and a real favicon/OG image if the camp has a brand asset.

## Photo credits

All photographs are Creative Commons via Wikimedia Commons; full attribution is
in the footer and repeated here:

- Ewaso Ng'iro at Samburu Intrepids — Daniel Case, CC BY-SA 4.0
- Samburu National Reserve — Wikimedia Commons, CC BY-SA
- Elephants crossing the Ewaso Ng'iro — Julian Mason, CC BY 2.0
- Samburu cultural festival — Antony Trivet, CC BY 2.0
- Mt. Ololokwe — Wikimedia Commons, CC BY-SA
- Lion — Giles Laurent, CC BY-SA 4.0
- Lilac-breasted roller — Charles J. Sharp, CC BY-SA 4.0
- Gerenuk — Bernard Dupont, CC BY-SA 2.0
- Grevy's zebra — André Karwath, CC BY-SA 2.5
- Beisa oryx, Samburu — ChrisHodgesUK, CC BY-SA 3.0
- Somali ostrich, Samburu — ninara, CC BY 2.0
- Reticulated giraffe — Quartl, CC BY-SA 3.0
- Lions Bluff Lodge hut — CT Cooper, CC BY 3.0
- Night sky — Carlos Zudaire / IAU OAE, CC BY 4.0
