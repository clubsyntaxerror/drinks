// Split out from drinksData.ts on purpose: components/templates.ts (imported by the
// client-side ScreenCarousel) needs DEFAULT_TEMPLATE_KEY as a real runtime value, and
// drinksData.ts pulls in sheets.ts -> googleapis/google-auth-library, which only run
// server-side (they touch Node built-ins like child_process). Importing that runtime value
// straight from drinksData.ts would drag the whole Google Sheets client into the browser
// bundle. This file has no other dependencies, so it's safe to import from either side.
export const TEMPLATE_KEYS = ["elixirs", "drinks"] as const;
export type TemplateKey = (typeof TEMPLATE_KEYS)[number];
export const DEFAULT_TEMPLATE_KEY: TemplateKey = "elixirs";
