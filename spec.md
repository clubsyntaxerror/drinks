# Syntax Error — Drinks & Elixirs Menu — Spec

Status: in implementation. `README.md` answered this spec's original open questions (folded in below, §12 lists what's still genuinely open); the project has since been scaffolded, and the data model was revised to an ingredient-inventory design (§8) partway through.

## 1. Purpose

A digital drinks menu for TV and mobile, styled as a retro dungeon-crawler item screen (see `reference/elixirs.jpg`): stone wall background, torches, gold pixel-art title, a grid of "potion" cards (icon, name, flavor, base spirit), and a scrollbox/ticker area for freeform announcements.

Content (drinks, elixirs, other categories, and scrollbox messages) is edited by non-developers in a Google Sheet, mirroring how [`syntaxerrorsthlm/website`](../website) already drives its `Events` data from Sheets. This is a **separate site** from that repo, sharing its tech stack and Sheets pattern but reading from its **own, separate spreadsheet**.

## 2. Reference image breakdown

`reference/elixirs.jpg` — a 5-column grid of 10 "potion" cards on a dungeon stone-wall background with two lit torches:

- Header: two-tier logo ("SYNTAX ERROR" small, "ELIXIRS" large gold pixel title) + subtitle "◆ CHOOSE YOUR POTION ◆"
- Each card: index number (01–10), potion bottle icon (color-coded per drink), drink name in a matching accent color, flavor line ("Pomegranate", "Kiwi & Green Apple"), base spirit row with a small glyph icon ("🍾 VODKA", "🌵 TEQUILA", "🌴 WHITE RUM")
- A wide empty bordered box below the grid — this is the **scrollbox**: a ticker/marquee area for rotating custom messages (announcements, happy hour, DJ shoutouts, etc.)

This spec generalizes the layout so it also works for a "Drinks" screen, "Shots" screen, etc., with the same card component.

## 3. Tech stack (mirrors `website`)

Chosen to match the existing sibling repo so both are maintainable by the same people with shared conventions:

- **Next.js 15** (App Router, `next dev --turbopack`)
- **React 19**, **TypeScript** (strict)
- **Tailwind CSS 3** for styling, same `.prettierrc` / prettier setup
- **`googleapis`** with a Google service-account JWT for **read-only** Sheets access — same auth pattern as `src/app/eventData.ts`
- **`@vercel/analytics`**, deploy target Vercel — same org as `website`, new subdomain (e.g. `menu.syntax-error.se`)
- A **new**, dungeon-style pixel font and a **new**, purpose-built potion-bottle/spirit icon set (not reused from `website` — see §10)
- No database — Sheets is the CMS, Next.js ISR (`revalidate`) + an `/api/revalidate` route is the caching layer, same as `website`

No state management library, no CSS-in-JS, no UI kit — consistent with the minimal footprint of `website`.

## 4. Routes & screen modes

| Route | Device                   | Behavior                                                                                                                                                                                                                                                |
| ----- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`   | Mobile / generic browser | Scrollable single page. All screens (Elixirs, Drinks, The Basics, Messages) render stacked as sections, in sheet-defined order. No forced auto-cycling — the user scrolls.                                                                              |
| `/tv` | TV / kiosk browser       | `100dvh`, `overflow: hidden`, **no scrolling ever**. Renders one "screen" at a time, full-bleed, and **auto-cycles** through screens on a timer read from the sheet. Landscape-only — no portrait/bigscreen mode planned. Public URL, no access gating. |

TV playback hardware (smart TV browser vs. streaming stick/kiosk box) is still undecided (§12) — doesn't block the build since the CSS-only background (§7) works fine on modest hardware either way.

Both routes are built from the **same** `<PotionCard>`, `<MenuGrid>`, `<ScreenHeader>`, `<Scrollbox>` components — `/tv` just wraps them in a cycling, viewport-locked shell, `/` wraps them in a stacked, scrollable shell. This avoids maintaining two visual implementations.

`/tv` supports debug query params: `?screen=<index>` to jump to a screen and `?paused=1` to stop the auto-cycle, for setup/testing on-site without redeploying.

## 5. Auto-cycling (TV mode)

- A client component (`ScreenCarousel`) holds the ordered list of screens (from the `Screens` sheet tab, §7) and an active index.
- `setInterval` (per-screen `durationSeconds` from the sheet, sensible default e.g. 12s) advances the index, wrapping around.
- Transition: simple crossfade by default; respects `prefers-reduced-motion` (drop to a hard cut, same convention as `website`'s `useMediaQuery("(prefers-reduced-motion: reduce)")` in `hero.tsx`).
- The `Messages`/scrollbox content is **not** a separate full screen by default — it's a persistent strip at the bottom of every screen (matching the reference image), independently ticking through messages on its own shorter interval. It _can_ become its own full screen too if the `Screens` tab includes a `messages`-type entry (e.g., for a dedicated "housekeeping" slide).

## 6. Responsive grid (no scroll on TV, scroll OK on mobile)

- Cards use a CSS grid: `grid-template-columns: repeat(auto-fit, minmax(Xrem, 1fr))`, so column count adapts to viewport width automatically.
- On `/tv`, item count is variable (sheet-driven) but scrolling is forbidden, so column count alone isn't enough — a `useFitToViewport` hook (ResizeObserver-based, same technique as `hero.tsx`'s background-resize observer) measures the grid against its container and scales down font-size/gap/columns in steps until content fits without overflow. This keeps the "5×2 potion grid" look at various item counts and TV resolutions instead of clipping.
- On `/`, the same grid is simply allowed to wrap and the page scrolls — no fit-to-viewport logic runs.

## 7. Background animation

**Decided: CSS/pixel-art flicker for v1**, no video loop. A looping torch-flicker effect done with layered `background-image` (pixel-art stone-wall + flame sprites) and CSS `@keyframes` opacity/brightness flicker (randomized-feeling via multiple overlapping animations, similar in spirit to the existing `.rainbow_text_animated` / `.zigzag` trickery in `website`'s `globals.css`). Cheap, no video decode needed, no asset pipeline, looks crisp at any TV resolution.

A video-loop mode (same pattern as `website`'s `hero.tsx`: `<video autoPlay muted loop playsInline>` with poster fallback and `prefers-reduced-motion` swap) can be added later as an alternative if a video asset ever gets produced, but it's not part of the initial build.

**Update:** `/tv` (not `/`) now also layers a static photo (`public/assets/background.jpg`) underneath the flicker/tint — `Background` takes an optional `image` prop. The existing brick/vignette gradient became translucent so it still works as a tint over the photo, and renders identically to before when no photo is supplied (mobile route, or `/tv` before the file exists). Still no video, still cheap.

## 8. Data model

**Revised model — an inventory, not a flat drink list.** Drinks don't carry their own flavor/base/color/icon fields. Instead there's a single **Ingredient inventory** (every spirit and every other component — fruit, mixer, garnish, or even a whole beverage like "Lager" for the Basics screen), and a **Recipe** is just a drink's name plus a list of ingredient ids. Everything visual — accent color, glyphs, the displayed spirit/flavor lines — is _derived_ from that composition, not entered per-drink. Marking one ingredient out of stock automatically crosses out every drink that contains it, with no per-drink flag to maintain: this is the "dungeon-crawler inventory system" behind the menu, and stock state lives in exactly one place.

Four logical entities, all sourced from the dedicated Sheets file (§9):

### Ingredient (the inventory)

```
id           string   — stable slug, e.g. "vodka", "pomegranate", "lager" — referenced by Recipe.ingredientIds
name          string   — display name, e.g. "Vodka", "Pomegranate"
kind           string   — "spirit" or anything else ("other") — determines which row of a card an ingredient renders in
icon            string?  — emoji/glyph, or (later) a bundled-icon key; falls back to a keyword-matched glyph or nothing (see §10)
color          string?  — hex accent color this ingredient contributes to any drink that includes it
inStock       boolean  — the single out-of-stock switch; toggling this cascades to every Recipe that references this ingredient
```

### Recipe (a drink/elixir/basic, as staff enter it)

```
order              number   — sort order within its category
category           string   — free text, e.g. "elixirs", "drinks", "basics" — NOT a hardcoded enum, so staff can add screens/categories without a code change
name                 string
ingredientIds     string[] — comma-separated ids into the Ingredient inventory (one or more spirits, one or more other ingredients)
tag                  string?  — e.g. "new", "seasonal"
active               boolean  — hide without deleting the row
```

### Composed item (derived at request time, not stored)

A Recipe resolved against the Ingredient inventory: its ingredients split into `spirits` (kind = "spirit") and `flavors` (everything else), an `accentColor` (first flavor's color, else first spirit's color, else a default gold), and `outOfStock` (true if any resolved ingredient has `inStock: false`). This is what `PotionCard` actually renders — see `composeRecipes()` in `src/app/drinksData.ts`.

### Message (scrollbox)

```
order      number
text        string
active      boolean
```

### Screen (drives cycling + section order)

```
order              number
key                 string   — matches a Recipe.category value
title               string   — screen header text, e.g. "Elixirs", "Drinks"
subtitle            string?  — e.g. "Choose your potion"
price               string?  — one price for everything on this screen, e.g. "139 kr" — shown once in the screen header, not per card
durationSeconds  number   — how long this screen stays up in TV mode
active              boolean
```

**Pricing is per-screen, not per-drink** (revised after the first visual pass): every item on a screen costs the same, so the price lives on `Screen` and is shown once in `ScreenHeader` (e.g. "139 kr each"), not repeated on every `PotionCard`. This also matches the reference image, which shows no price on individual cards at all.

Fetchers follow `website`'s `Event` type pattern (typed row-mapping function, `undefined`-safe optional columns, `cache()`-wrapped, `revalidate`-driven).

Confirmed screens for launch: **Elixirs**, **Drinks**, and a third screen covering beers, ciders, wines, sparkling wines, and sodas — working title **"The Basics"** (final name TBD, §12). Basics items are modeled as a Recipe with a single non-spirit ingredient (e.g. a "Lager" ingredient referenced by a "Lager" recipe), not a special case in code.

## 9. Google Sheets integration

- **New, separate spreadsheet** — not a new tab on the existing Events sheet — so the bar team can be given edit access to just this file.
- Same service account can be reused (share the new spreadsheet with the existing `GOOGLE_SHEETS_CLIENT_EMAIL`) or a fresh service account can be created — either works technically; reusing is simpler ops-wise.
- New env var: `DRINKS_SPREADSHEET_ID` (parallel to `website`'s `SPREADSHEET_ID`).
- Tabs: `Items`, `Messages`, `Screens` (§8), fetched with `sheets.spreadsheets.values.get({ range: "<TabName>" })`, one call per tab, each wrapped in React's `cache()` like `getEvents`.
- Revalidation: same `revalidate = N` + `/api/revalidate` route pattern as `website`, but with a **much shorter window** than the 3600s used for events — periodic refresh (target ~120s) was chosen over building an instant Apps-Script-webhook path, so a sheet edit shows up on the TV within roughly two minutes with no extra moving parts.

## 10. Images & icons — can images be embedded in a Sheets cell?

Two Sheets mechanisms exist, and neither is a good fit as the primary path:

1. **`=IMAGE(url)` formula** — the cell just renders an image _from a URL_ inside the Sheets UI. The cell's actual value/formula returned by the API is the formula text (or the URL, depending on `valueRenderOption`), not binary image data. This is fine as a way for staff to _preview_ an icon in-sheet, but it means the real image still has to live at a stable public URL somewhere else.
2. **"Insert image in cell" (the newer, actual in-cell image object)** — this stores a real image blob attached to the cell. However, the Sheets API v4 (`spreadsheets.values.get`) does **not** reliably expose this as fetchable binary — it's a UI/Docs-Editors feature without solid first-class API support for extracting the image file. Not something to build a menu's image pipeline on.

**Recommendation:** don't source pixel-art/icons from the sheet at all. Instead:

- Ship a **bundled icon set** in `/public/icons/` (potion bottles, spirit glyphs, torch sprites) — exactly how `website` already does it (`hero.tsx`'s `/icons/date.png`, `links.tsx`'s `/social/*.svg`, all hardcoded, none sheet-driven).
- With the inventory model (§8), the image reference lives on **`Ingredient.icon`**, once per spirit/component, not once per drink — an emoji/glyph today, a key into the bundled set once real art exists. A small lookup (`components/icons.tsx`) resolves it, falling back to a keyword-matched glyph or a generated shape tinted by `Ingredient.color`/the composed `accentColor` if blank. Because it's per-ingredient, adding art for "Vodka" instantly reuses across every drink that contains vodka — no per-drink duplication.
- If a specific drink ever needs a one-off custom photo, that's still an escape hatch on the _ingredient_, not the drink: a direct-hosted image URL in `Ingredient.icon` behaves like a normal `<img src>`. This avoids depending on Drive's inconsistent public-image-serving behavior.
- New icons/ingredients get added the same way `website` adds new photos/icons today: a small PR adding a file to `/public/icons/`. This is a deliberate tradeoff — it means adding a _brand-new_ icon needs a code change, but it keeps the whole image pipeline simple, fast, and cache-friendly, and staff only ever touch text/ids in the sheet for day-to-day menu edits (including day-to-day stock toggling, which needs no code change at all).

## 11. Non-goals (out of scope unless you say otherwise)

- No ordering/payment flow — this is a display-only menu board.
- No admin UI beyond the Google Sheet itself.
- No multi-venue support — single spreadsheet, single menu (unless you tell me otherwise).
- No user accounts/auth.

## 12. Decisions from `README.md`, and what's still open

Resolved:

- Screens: Elixirs, Drinks, and a beer/cider/wine/sparkling/soda screen (working title "The Basics")
- Prices: one per screen (e.g. "139 kr each" in the header), not per card — revised after the first visual pass, see §8
- Fonts/icons: bespoke new pixel font + new potion-bottle/spirit icon set, not reused from `website`
- Background: CSS pixel-flicker, no video for v1; `/tv` additionally layers a static photo under the flicker (see §7)
- Update cadence: periodic revalidate (~120s), no Apps Script webhook
- Deploy: same Vercel org as `website`, new subdomain
- Access to `/tv`: normal public URL, no gating
- Language: English only
- Orientation: landscape only, no portrait/bigscreen mode

Still genuinely open (don't block scaffolding, but need answers before final polish/launch):

1. **TV playback hardware** — smart TV browser vs. streaming stick/kiosk box is still undecided. Doesn't change the build since the CSS background has no special hardware requirements either way.
2. **Final name for the third screen** — "The Basics" is a placeholder; needs a name in the same voice as "Elixirs".
3. **Who produces the new font + icon set, and how** — AI-generated (like the reference image), commissioned pixel artist, or an existing icon pack adapted to a shared palette. Blocks final visual polish, not initial scaffolding (placeholders can stand in).
4. **Price formatting** — plain string per item is flexible enough to start; whether currency/formatting conventions need to be more structured can be revisited once real menu data exists.
