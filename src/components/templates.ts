import type { ComponentType } from "react";
import type { Item } from "../app/drinksData";
// DEFAULT_TEMPLATE_KEY/TemplateKey come from templateKeys.ts, not drinksData.ts — this module
// is imported by the client-side ScreenCarousel, and drinksData.ts pulls in ./sheets ->
// googleapis (server-only). `Item` above is a type-only import so it's erased at build time
// and doesn't have the same problem.
import { DEFAULT_TEMPLATE_KEY, type TemplateKey } from "../app/templateKeys";
import MenuGrid from "./MenuGrid";
import RosterGrid from "./RosterGrid";

export type TemplateDefinition = {
    Grid: ComponentType<{ items: Item[]; fitToViewport?: boolean }>;
    backgroundImage: string | undefined;
    backgroundTheme: "dungeon" | "arcade";
};

// One entry per TemplateKey (see ../app/templateKeys.ts) — the full visual identity a Screen
// picks up through its `template` field: which grid/card component renders its items, and
// which Background mood sits behind it. A new "location" in the game (a genuinely different
// screen concept, not just a reskin) is a new entry here plus whatever Grid/Card component it
// needs — not a pile of "if template === ..." conditionals spread across shared components.
const TEMPLATES: Record<TemplateKey, TemplateDefinition> = {
    elixirs: {
        Grid: MenuGrid,
        backgroundImage: "/assets/background.jpg",
        backgroundTheme: "dungeon",
    },
    drinks: {
        // WIP placeholder — no bespoke frame/character-portrait art yet, so this leans on
        // plain CSS (RosterGrid's .character-card) rather than bespoke card art. The
        // background photo itself is real (public/assets/background-drinks.png).
        Grid: RosterGrid,
        backgroundImage: "/assets/background-drinks.png",
        backgroundTheme: "arcade",
    },
};

export function getTemplate(key: TemplateKey): TemplateDefinition {
    return TEMPLATES[key] ?? TEMPLATES[DEFAULT_TEMPLATE_KEY];
}
