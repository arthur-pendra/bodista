# Bodista — Shopify Hydrogen storefront

## Stack

- Shopify Hydrogen (`@shopify/hydrogen`) on React Router 7
- TypeScript, Vite, npm
- Deployment: Shopify Oxygen
- Three.js / @react-three/fiber for WebGL, GSAP for animations, Lenis for smooth scroll
- Dev server: `npm run dev`

## Styling architecture

Two layers. Keep them strictly separated.

### 1. Base styling → `app/styles/global.css`

All **reusable base** lives here and may be used anywhere in the app:

- Font faces (Novela)
- The **Osmo scaling system** (`--size-font`, `--size-container`, breakpoints)
- **Design tokens** in `:root` — colours, the type scale (`--text-*`), leading (`--leading-*`), tracking, easings (`--ease-*`), grid tokens, `--radius-pill`, `--header-height` (see the **Design tokens** section below)
- Generic element styling (`body`, `h1`, `h2`, `p`, `a`, `input`, `section`, …) + the numeral helpers (`.ui-nums`, `.ui-nums-zero`, `.ui-nums-symbol`)
- Reset + utility classes (`.sr-only`, `.link`, `button.reset`, `.layout-grid`)
- Styling for the default Hydrogen scaffolding (header, footer, cart, search, collections, product, blog, account)

Never rewrite base styling inside a component — use what already lives here.

### 2. Component-specific styling → `Component.module.css`

When you build your **own component**:

- Lean on the base from `global.css` (typography, colors, variables, and `section` padding are inherited automatically).
- Only write the **extra** styling specific to that component in a CSS Module **next to** the component: `Component.module.css`.
- Import as `import styles from './Component.module.css'` and use `className={styles.name}` (camelCase class names).

Reference examples: `app/components/home/HeroHeader.tsx` + `HeroHeader.module.css`,
`app/components/home/ProductHighlights.tsx` + `ProductHighlights.module.css`.

## Scaling & responsive — Osmo (required)

**Core rule:** pick the unit based on behavior, not dogma. Should something **scale with the design** → `em`. Should something **stay crisp or keep a fixed lower bound** → `px` or `rem`.

- **Default = `em`.** All layout and typography sizing that scales with the design: `em`. 1em = the scaling body font-size (`--size-font`). **Base unit is 14px** (`--size-unit: 14`), so on the 1440 design reference 1em = 14px → **Figma value / 14 = em** (28px → 2em, 49px → 3.5em). For typography prefer a `--text-*` token over a raw font-size (see **Design tokens**).
- **`em` is required for** type-related spacing: `letter-spacing`, `line-height`, and spacing that should scale with the text. Never px here.
- **Use `px` for things that must not scale:**
  - Hairline `1px` borders, outlines and dividers (in `em` they become blurry/sub-pixel).
  - `box-shadow` blur/spread (must not explode on large screens).
  - Breakpoint and container definitions in the Osmo block.
  - Canvas / WebGL (Three.js, @react-three/fiber) and Mapbox — they render in pixels + `devicePixelRatio`; size in `px`/`%`, never `em`.
  - Pixel nudges (`transform: translate(…px)`), focus-ring offsets.
- **Use `rem` for accessibility floors** (respects the user preference, does not scale with `--size-font`):
  - `min-height`/`min-width` of tap targets (guideline ≥ 44px, hard minimum ~24px).
  - A minimum readable font-size as a floor.
- **Not allowed:** fixed `px` for ordinary layout/typography sizes that should scale with the design — those must be `em`.
- The `.sr-only` utility uses px (allowed).
- Breakpoints (desktop-first): 1440 desktop / 834 tablet (≤991) / 550 mobile landscape (≤767) / 390 mobile portrait (≤479).

## Design tokens (`global.css` `:root`) — required

Never write a raw hex or a loose `font-size` in a component. Always use a token.

### Type scale — 6 sizes + 1 micro (no more)

Three headings + three body sizes + one micro-caption. All in `em` so they scale with `--size-font`. px shown at the 1440 reference (× 14).

- `--text-heading-lg` 3.5em (49px) — display / hero & big section heads
- `--text-heading-md` 1.5em (21px) — standard section heads
- `--text-heading-sm` 1.25em (17.5px) — small heads & subtitles
- `--text-body-lg` 1.125em (15.75px) — lead / larger body
- `--text-body` 1em (14px) — body copy
- `--text-detail` 0.875em (12.25px) — labels, captions, prices
- `--text-caption` 0.5em (7px) — uppercase micro-eyebrows

Each size has a matching leading token: `--leading-heading-lg/md/sm`, `--leading-body-lg`, `--leading-body`, `--leading-detail`, `--leading-caption`. Gold detail-text tracking: `--tracking-detail` (0.08em).

### Colour — brand palette (see `BrandGuide.tsx`)

As **text** colour use only these five:

- `--color-charcoal` #222 — all headings & body copy, dark/closing sections (**default text colour**)
- `--color-body` #5c594f — reserved for body/explainer text
- `--color-warm` #f4eee2 — light text on dark; light backgrounds
- `--color-gold` #c5a55a — logotype, eyebrows/labels, CTAs
- `--color-silver` #b5b0a4 — serum, Step II markers, gradient ends

Structural chrome (surfaces/lines only, never brand text): `--color-page` #e5e0d5 (body fill), `--color-hairline` (black 10%). **Scaffolding-only** (Hydrogen default UI — do **not** use in your own components): `--color-dark`, `--color-light`, `--color-ink`.

### Numerals — old-style by default

Body copy uses Novela's old-style figures (3/4/5/7/9 drop below the baseline). For **functional numbers** (prices, sizes, counters, quantities) switch to lining + tabular via `.ui-nums`. The `0` stays the round old-style glyph via the `<Figures>` helper (`.ui-nums-zero`); currency symbols are nudged onto the lining baseline with `.ui-nums-symbol`. **Money always renders through the `LiningMoney` component, never Hydrogen's `<Money>`.**

### Easings

Osmo easing tokens: `--ease-osmo` (default UI), `--ease-energy`, `--ease-smooth`, `--ease-punch`, `--ease-relaxed`, `--ease-expo-inout`, `--ease-jump`, `--ease-pop`, `--ease-anticipate`, `--ease-fade`. Use `var(--ease-…)` in transitions/animations.

## Layout grid — pixel-perfect (required for grid work)

There is one shared column grid. The **GridOverlay dev tool** draws it, and content aligns to it via the same tokens. Overlay and content can therefore never drift apart.

### Specs

| | Desktop (>767px) | Mobile (≤767px) |
|---|---|---|
| Columns | **24** | **12** |
| Margin (outer margin) | `--grid-margin` = 1.875em (30px) | 1em (16px) |
| Gutter (between columns) | `--grid-gutter` = 1.25em (20px) | 1.25em (20px) |

24 columns (desktop) keeps all the divisibility of 12 (2/3/4/6/12) but doubles the placement resolution. A clean 4-up still works: `grid-column: span 6` (24 ÷ 6 = 4-up desktop, 12 ÷ 6 = 2-up mobile).

Tokens live in `global.css` `:root` (with a mobile override): `--grid-columns`, `--grid-margin`, `--grid-gutter`. Change the grid here — overlay and content follow automatically.

### The overlay (dev tool)

- Toggle with the **`G` key** (ignored while typing in a field). Dev only (`import.meta.env.DEV`).
- Columns are **numbered** (1–24 desktop, 1–12 mobile) → this is how we refer to positions.
- Component: `app/components/GridOverlay.tsx`.

### Placing content on the grid

Put a wrapper on `className="layout-grid"` (the global utility) and place children with `grid-column`.

**Line arithmetic (important):** 24 columns = 25 lines. Column *N* runs from line *N* to line *N+1*.
→ "column **X through Y**" = `grid-column: X / (Y+1)` i.e. `grid-column: X / span (Y−X+1)`.

```css
/* "Put this on column 5 through 16" (desktop, 24-column) */
.block {
  grid-column: 5 / 17; /* = 5 / span 12 */
}

/* Mobile is 12-column → reposition, otherwise the position is wrong */
@media (max-width: 767px) {
  .block {
    grid-column: 1 / -1; /* full width on mobile */
  }
}
```

Examples of instructions → CSS:
- "full width" → `grid-column: 1 / -1`
- "left half desktop" (column 1 through 12) → `grid-column: 1 / 13`
- "right half" (column 13 through 24) → `grid-column: 13 / 25`
- "centered, column 7 through 18" → `grid-column: 7 / 19`

### Rules

- **Always** position with `grid-column` lines, never by guessing loose `px`/`%` widths — this keeps it pixel-perfect on the grid.
- For every grid placement **also provide the mobile variant** (12 columns); a 24-column `grid-column` does not match a 12-column grid.
- Margin/gutter come from the tokens — do not redefine them per component.
- **Alignment rule:** the overlay (and `.layout-grid`) aligns to the **viewport edge**. `body > main` has a `margin: 0 1em` — so a `.layout-grid` inside `main` shifts 1em and does not align with the overlay. Therefore place grid wrappers **full-bleed** (outside `main`, or break out of the margin), so the outer margin comes purely from `--grid-margin`.

## Visual style (required)

- **Typography — Novela only.** The entire site runs on **one** font: **Novela Display**. Two real cuts: **Regular** and **Italic** (`font-style: italic`). Beyond that, create distinction with **weight, size, letter-spacing and `text-transform` (incl. all-caps/uppercase)** — never with another font. Forbidden: system/sans fonts, Google Fonts, Tailwind stacks or any extra font whatsoever. The `@font-face` faces + `font-family` already live in `global.css` (with Georgia-serif only as a technical fallback); inherit those — never drop in a new `font-family` yourself. When working from the **Figma MCP**, copy exactly what is there: it has no font other than Novela either. Follow the **style guide** (see `app/components/brand/BrandGuide.tsx`).
- **Images always sharp — never a `border-radius`.** Base sets `img { border-radius: 0 }`; do not add radius on images anywhere.
- **Action/CTA buttons are square.** `button:not(.reset)` gets `border-radius: 0` globally. `--radius-pill` (100em) still exists for elements that must be fully rounded (e.g. the `.product-pill`), but it is **not** applied to buttons by default. Text/icon buttons with `.reset` stay bare. Form controls (`button`, `input`, `select`, `textarea`) inherit the Novela font via a global rule — never set a `font-family` yourself.
- **Never underline.** `a` has `text-decoration: none`; hover feedback uses only cursor/opacity/colour — do not re-add `text-decoration: underline` anywhere.

## Shopify access

- The Shopify store for this project is **bodista**. Do **not** operate on "Dare to Dream Apparel" — the built-in claude.ai Shopify MCP connected to that wrong store once; ignore it.
- Shopify access goes **via Composio** (`mcp__claude_ai_composio__*` tools), connection `shopify` (account `shopify_passer-suwe`). Route all Shopify reads/writes through Composio and verify the active store is bodista before any write.

## Klaviyo access

- Klaviyo goes **via Composio** (`mcp__claude_ai_composio__*` tools), toolkit `klaviyo`, account **`BODISTA`** (id `klaviyo_rigid-arhar`). Always pass `account: "BODISTA"` on every Klaviyo tool call.
- There is a second Klaviyo account in Composio, **`DARETODREAM`** (id `klaviyo_thos-gaslit`) — that is a different project. Never operate on it.
- Do **not** use the built-in `mcp__claude_ai_Klaviyo__*` tools — those connect to a different account ("Candela"), not Bodista. Route all Klaviyo reads/writes through Composio with the `BODISTA` account.

## Conventions

- Functional components, arrow functions, no semicolons (`prettier` = `@shopify/prettier-config`).
- Commits in English. Never commit without explicit approval.
- `npm run typecheck` for type checks, `npm run lint` for eslint.
