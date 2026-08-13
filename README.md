# Syntax Error — Drinks Menu

Digital drinks/elixirs menu for Club Syntax Error, built for a TV screen behind the bar and for mobile phones. Retro dungeon-crawler item-screen style (potion bottles, stone wall, torches), matching `reference/elixirs.jpg`.

Sibling project to [`syntaxerrorsthlm/website`](../website) — same tech stack (Next.js, React, TypeScript, `googleapis`), but a separate app with its own separate Google Sheet as its CMS. Styling is plain hand-written CSS, not Tailwind (unlike `website`).

## What this is

- A **TV menu board** (`/tv`): full-screen, no scrolling, auto-cycles through menu screens on a timer. Deployed to a TV/screen behind the bar; the URL is public (no gating needed).
- A **mobile menu** (`/`): the same content as a normal scrolling page, so guests can browse it on their phone.
- Content — drink/elixir names, flavors, base spirits, prices, and rotating scrollbox announcements — is edited by bar staff in a Google Sheet, not in code. The site polls that sheet periodically (no instant push needed) and picks up edits within a few minutes.

## Menu screens

Three screens today, cycling in this order on `/tv` and stacked in this order on `/`:

1. **Elixirs** — the flagship cocktail menu (as in `reference/elixirs.jpg`), styled as a dungeon-crawler inventory grid
2. **Drinks** — other cocktails, styled as a video-game character-select roster (each drink's `emblem` doubles as a placeholder character portrait)
3. **The Basics** _(working title — beers, ciders, wines, sparkling wines, sodas)_

Screens are driven from the sheet's `Screens` tab, so this list (name, order, timing) can change without a code deploy. Each item can carry its own price, shown on the card itself (e.g. "139:-").

### Templates

Each screen picks a visual **template** — not just a color/asset skin, but a genuinely different screen concept (a different "location" in the game, per `spec.md` §8/§13). `elixirs` (dungeon inventory grid) and `drinks` (character-select roster, split into a joke "This Side"/"That Side" for roster-select flavor) exist today; adding a third is a new entry in `src/components/templates.ts` plus whatever Grid/Card component it needs, not a growing pile of conditionals in shared components. The Drinks/character-select look is a deliberate placeholder (plain CSS, no bespoke frame/portrait art) until real art exists — see that file's comments.

## Look & feel

- Landscape-only layout (no dedicated portrait/phone-holder mode)
- Animated background via CSS pixel-flicker (torches etc.), no video loop for v1
- `/tv` layers a static photo (`public/assets/background.jpg`) under the flicker/tint for extra atmosphere. The mobile route (`/`) stays flicker-only.
- New pixel font + new potion-bottle/spirit icon set, purpose-built for this menu (not reused from `website`)

## Data source

Content lives in a dedicated Google Sheet (not the same spreadsheet `website` uses for events), read via a read-only Google service account, same auth mechanism as `website`'s `eventData.ts`.

Environment variables (see `.env.local`, not committed):

- `GOOGLE_SHEETS_CLIENT_EMAIL` — service account email (can reuse the same service account as `website`, or a new one — either just needs to be shared on the drinks spreadsheet)
- `GOOGLE_SHEETS_PRIVATE_KEY` — service account private key
- `DRINKS_SPREADSHEET_ID` — the ID of this project's spreadsheet

Full data model and sheet tab layout are in [`spec.md`](spec.md).

### Sheet setup

The drinks spreadsheet needs four tabs, header row included. Drinks don't carry their own flavor/color/icon — they're composed from an ingredient inventory, so marking one ingredient out of stock automatically crosses out every drink that uses it.

**`Ingredients`** — every spirit and every other component (fruit, mixer, garnish, or a whole Basics beverage like "Lager"):

| id            | name        | kind     | icon | color     | inStock |
| ------------- | ----------- | -------- | ---- | --------- | ------- |
| `vodka`       | Vodka       | `spirit` | 🍾   | `#cbd5e1` | `TRUE`  |
| `pomegranate` | Pomegranate | `other`  |      | `#dc2626` | `TRUE`  |

- `id` is the stable slug referenced from `Items.ingredientIds` — don't rename it once drinks use it.
- `kind` is `spirit` or anything else (treated as `other`); it decides whether the ingredient shows in a card's spirit row or flavor line.
- `icon` is optional (an emoji works fine); blank falls back to a keyword-matched glyph or nothing.
- `inStock` — set to `FALSE` to instantly cross out every drink containing this ingredient.

**`Items`** — the drinks/elixirs/basics themselves:

| order | category  | name          | emblem | ingredientIds       | active | price |
| ----- | --------- | ------------- | ------ | ------------------- | ------ | ----- |
| `1`   | `elixirs` | Health Potion | ❤️     | `vodka,pomegranate` | `TRUE` | `139` |

- `category` matches a `Screens.key` below.
- `emblem` is optional — an emoji embossed into the potion icon's liquid (e.g. ❤️ for Health Potion, matching `reference/elixirs.jpg`). Blank just omits it.
- `ingredientIds` is a comma-separated list of `Ingredients.id` values — one or more spirits, one or more others.
- `price` is optional — a plain number, no currency symbol. Shown on the card as e.g. "139:-"; leave blank for an item with no listed price.

**`Messages`** — scrollbox content:

| order | text                                          | active | fromTime | toTime  |
| ----- | --------------------------------------------- | ------ | -------- | ------- |
| `1`   | Happy hour 18:00–20:00 — 20% off all Elixirs  | `TRUE` |          |         |
| `2`   | Happy hour: beer/cider/wine/soda until 23:00! | `TRUE` |          | `23:00` |

- `fromTime`/`toTime` are both optional `HH:MM` bounds on when a message shows — leave either blank to leave that side open. Outside the window it just doesn't show; no need to flip `active` by hand.
- The venue's day runs 03:00 → 03:00 the next morning (last call, closing, etc. all land after midnight), so `fromTime: 01:00` means "from just after midnight," not "any time after 1am the previous afternoon." See `isWithinDailyWindow` in `src/components/utils/time.ts`.
- Re-checked in the browser once a minute, so a message scheduled to end at 23:00 drops off the TV on its own, without a page reload.

**`Screens`** — drives cycling order/timing on `/tv` and section order on `/`:

| order | key       | title      | subtitle                   | durationSeconds | active | template  |
| ----- | --------- | ---------- | -------------------------- | --------------- | ------ | --------- |
| `1`   | `elixirs` | Elixirs    | Choose your potion         | `14`            | `TRUE` | `elixirs` |
| `2`   | `drinks`  | Drinks     | Classic & signature        | `14`            | `TRUE` | `drinks`  |
| `3`   | `basics`  | The Basics | Beer · Cider · Wine · Soda | `14`            | `TRUE` | `elixirs` |

- `template` is optional — one of the keys in `src/components/templates.ts` (currently `elixirs` or `drinks`). Blank or an unrecognized value falls back to whichever key `DEFAULT_TEMPLATE_KEY` (`src/app/templateKeys.ts`) points at, so an old sheet row or a typo doesn't break the screen — it just renders in the default look instead.

Until the spreadsheet exists (or env vars aren't set), the site falls back to bundled sample data (`src/app/sampleData.ts`) so `npm run dev` always renders a real-looking menu.

## Deploy

Same Vercel account/org as `website`, on a new subdomain (e.g. `drinks.syntax-error.se`) rather than a separate domain.

## Getting started

To work on the site, you will need Node installed and the environment variables above set in `.env.local`.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the mobile view, [http://localhost:3000/tv](http://localhost:3000/tv) for the TV view.
