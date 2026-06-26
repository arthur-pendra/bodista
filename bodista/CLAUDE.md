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
- CSS custom properties (`--color-dark`, `--header-height`, etc.)
- Generic element styling (`body`, `h1`, `h2`, `p`, `a`, `input`, `section`, …)
- Reset + utility classes (`.sr-only`, `.link`, `button.reset`)
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

- **Default = `em`.** All layout and typography sizing that scales with the design: `em`. 1em = the scaling body font-size (`--size-font`). Figma value / 16 = em value (32px → 2em).
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
- **Buttons are pill-shaped** (full radius via `--radius-pill`). Applies automatically to every real action/CTA button (`button:not(.reset)`). Text/icon buttons with the `.reset` class are excluded (they stay bare).
- **Never an underline hover** on links or text. Globally disabled (`a:hover`, `.link:hover`, `button.reset:hover`) — do not re-add `text-decoration: underline` on hover anywhere. Hover feedback may use opacity/color, not underline.

## Conventions

- Functional components, arrow functions, no semicolons (`prettier` = `@shopify/prettier-config`).
- Commits in English. Never commit without explicit approval.
- `npm run typecheck` for type checks, `npm run lint` for eslint.
