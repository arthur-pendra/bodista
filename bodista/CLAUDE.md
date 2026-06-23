# Bodista — Shopify Hydrogen storefront

## Stack

- Shopify Hydrogen (`@shopify/hydrogen`) op React Router 7
- TypeScript, Vite, npm
- Deployment: Shopify Oxygen
- Three.js / @react-three/fiber voor WebGL, GSAP voor animaties, Lenis voor smooth scroll
- Dev server: `npm run dev`

## Styling-architectuur

Twee lagen. Houd ze strikt gescheiden.

### 1. Base styling → `app/styles/global.css`

Alle **herbruikbare basis** staat hier en mag overal in de app gebruikt worden:

- Font-faces (Novela)
- Het **Osmo scaling system** (`--size-font`, `--size-container`, breakpoints)
- CSS custom properties (`--color-dark`, `--header-height`, etc.)
- Generieke element-styling (`body`, `h1`, `h2`, `p`, `a`, `input`, `section`, …)
- Reset + utility classes (`.sr-only`, `.link`, `button.reset`)
- Styling voor de standaard Hydrogen-scaffolding (header, footer, cart, search, collections, product, blog, account)

Schrijf basis nooit opnieuw in een component — gebruik wat hier al staat.

### 2. Component-specifieke styling → `Component.module.css`

Wanneer je een **eigen component** bouwt:

- Leun op de base uit `global.css` (typografie, kleuren, variabelen, `section`-padding erven automatisch).
- Schrijf alleen de **extra** styling die specifiek voor dat component is in een CSS Module **naast** het component: `Component.module.css`.
- Importeer als `import styles from './Component.module.css'` en gebruik `className={styles.naam}` (camelCase class-namen).

Referentievoorbeelden: `app/components/home/HeroHeader.tsx` + `HeroHeader.module.css`,
`app/components/home/ProductHighlights.tsx` + `ProductHighlights.module.css`.

## Scaling & responsive — Osmo (verplicht)

**Kernregel:** kies de unit op basis van gedrag, niet uit dogma. Moet iets **meeschalen met het design** → `em`. Moet iets **crisp blijven of een vaste ondergrens houden** → `px` of `rem`.

- **Default = `em`.** Alle layout- en typografie-sizing die met het design meeschaalt: `em`. 1em = de meeschalende body font-size (`--size-font`). Figma-waarde / 16 = em-waarde (32px → 2em).
- **`em` is verplicht voor** type-gerelateerde spacing: `letter-spacing`, `line-height`, en spacing die met de tekst hoort mee te schalen. Hier nooit px.
- **Gebruik `px` voor dingen die niet mogen meeschalen:**
  - Hairline `1px` borders, outlines en dividers (in `em` worden ze wazig/sub-pixel).
  - `box-shadow` blur/spread (mag op groot scherm niet exploderen).
  - Breakpoint- en container-definities in het Osmo-blok.
  - Canvas / WebGL (Three.js, @react-three/fiber) en Mapbox — die renderen op pixels + `devicePixelRatio`; size in `px`/`%`, nooit `em`.
  - Pixel-nudges (`transform: translate(…px)`), focus-ring offsets.
- **Gebruik `rem` voor toegankelijkheids-ondergrenzen** (respecteert de gebruikersvoorkeur, schaalt niet mee met `--size-font`):
  - `min-height`/`min-width` van tap-targets (richtlijn ≥ 44px, hard minimum ~24px).
  - Een minimale leesbare font-size als floor.
- **Niet toegestaan:** vaste `px` voor gewone layout-/typografie-maten die wél met het design horen mee te schalen — dat hoort `em` te zijn.
- `.sr-only` utility gebruikt px (toegestaan).
- Breakpoints (desktop-first): 1440 desktop / 834 tablet (≤991) / 550 mobile landscape (≤767) / 390 mobile portrait (≤479).

## Layout grid — pixel-perfect (verplicht bij grid-werk)

Er is één gedeeld kolom-grid. De **GridOverlay dev-tool** tekent het, en content lijnt er via dezelfde tokens op uit. Overlay en content kunnen dus nooit uit elkaar lopen.

### Specs

| | Desktop (>767px) | Mobiel (≤767px) |
|---|---|---|
| Kolommen | **12** | **6** |
| Margin (buitenmarge) | `--grid-margin` = 1.875em (30px) | 1em (16px) |
| Gutter (tussen kolommen) | `--grid-gutter` = 1.25em (20px) | 1.25em (20px) |

Tokens staan in `global.css` `:root` (met mobiele override): `--grid-columns`, `--grid-margin`, `--grid-gutter`. Wijzig het grid hier — overlay én content volgen automatisch.

### De overlay (dev-tool)

- Toggle met de **`G`-toets** (genegeerd tijdens typen in een veld). Alleen in dev (`import.meta.env.DEV`).
- Kolommen zijn **genummerd** (1–12 desktop, 1–6 mobiel) → zo refereren we naar posities.
- Component: `app/components/GridOverlay.tsx`.

### Content op het grid zetten

Zet een wrapper op `className="layout-grid"` (de globale utility) en plaats kinderen met `grid-column`.

**Lijn-rekenkunde (belangrijk):** 12 kolommen = 13 lijnen. Kolom *N* loopt van lijn *N* tot lijn *N+1*.
→ "kolom **X t/m Y**" = `grid-column: X / (Y+1)` ofwel `grid-column: X / span (Y−X+1)`.

```css
/* "Zet dit op kolom 3 t/m 8" (desktop, 12-koloms) */
.block {
  grid-column: 3 / 9; /* = 3 / span 6 */
}

/* Mobiel is 6-koloms → herplaatsen, anders klopt de positie niet */
@media (max-width: 767px) {
  .block {
    grid-column: 1 / 7; /* volledige breedte op mobiel */
  }
}
```

Voorbeelden van instructies → CSS:
- "volle breedte" → `grid-column: 1 / -1`
- "kolom 1 t/m 6" (linkerhelft desktop) → `grid-column: 1 / 7`
- "kolom 7 t/m 12" (rechterhelft) → `grid-column: 7 / 13`
- "gecentreerd, kolom 4 t/m 9" → `grid-column: 4 / 10`

### Regels

- Posities **altijd** in `grid-column`-lijnen, nooit met losse `px`/`%`-breedtes raden — zo blijft het pixel-perfect op het grid.
- Bij elke grid-plaatsing **ook de mobiele variant** (6 koloms) opgeven; een 12-koloms `grid-column` klopt niet op een 6-koloms grid.
- Margin/gutter komen uit de tokens — niet per component opnieuw definiëren.
- **Alignment-regel:** de overlay (en `.layout-grid`) lijnt op de **viewport-rand**. `body > main` heeft een `margin: 0 1em` — een `.layout-grid` binnen `main` schuift dus 1em op en lijnt niet met de overlay. Plaats grid-wrappers daarom **full-bleed** (buiten `main`, of breek uit de marge), zodat de buitenmarge puur uit `--grid-margin` komt.

## Visuele stijl (verplicht)

- **Afbeeldingen altijd strak — nooit een `border-radius`.** Base staat op `img { border-radius: 0 }`; voeg nergens radius op images toe.
- **Buttons zijn pill-vormig** (volle radius via `--radius-pill`). Geldt automatisch voor elke echte action-/CTA-button (`button:not(.reset)`). Text-/icon-buttons met de `.reset`-class zijn uitgezonderd (die blijven kaal).
- **Nooit een underline-hover** op links of tekst. Globaal uitgezet (`a:hover`, `.link:hover`, `button.reset:hover`) — voeg `text-decoration: underline` op hover nergens opnieuw toe. Hover-feedback mag via opacity/kleur, niet via underline.

## Conventies

- Functional components, arrow functions, geen semicolons (`prettier` = `@shopify/prettier-config`).
- Commits in het Engels. Commit nooit zonder expliciete goedkeuring.
- `npm run typecheck` voor type-checks, `npm run lint` voor eslint.
