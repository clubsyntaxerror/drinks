// Placeholder content shown when the Google Sheet isn't configured yet (no env vars) or is
// reachable but empty. Lets `npm run dev` render a real-looking menu before the spreadsheet
// exists. Swapped out automatically the moment the sheet returns real rows — see getMenuData().
import type { Ingredient, Recipe, Message, Screen, CategoryPricing, PriceListEntry } from "./drinksData";

export const sampleIngredients: Ingredient[] = [
    // Spirits. `icon` is set explicitly here rather than left to IngredientGlyph's
    // keyword-fallback guess (see components/icons.tsx) — prosecco doesn't match any of that
    // fallback's keywords, so it'd otherwise silently render with no glyph.
    { id: "vodka", name: "Vodka", kind: "spirit", icon: "🍾", color: "#cbd5e1", inStock: true },
    { id: "gin", name: "Gin", kind: "spirit", icon: "🌿", color: "#4ade80", inStock: true },
    { id: "tequila", name: "Tequila", kind: "spirit", icon: "🌵", color: "#eab308", inStock: true },
    { id: "white-rum", name: "White Rum", kind: "spirit", icon: "🌴", color: "#38bdf8", inStock: true },
    // Prosecco is kind "spirit" (unlike Lager/IPA/Cider/Soda below, which are kind "other") so
    // it renders in the spirit/glyph row of its Basics recipe rather than the flavor row.
    { id: "prosecco", name: "Prosecco", kind: "spirit", icon: "🥂", color: "#eab308", inStock: true },

    // Elixir flavor ingredients
    { id: "pomegranate", name: "Pomegranate", kind: "other", icon: undefined, color: "#dc2626", inStock: true },
    { id: "blue-raspberry", name: "Blue Raspberry", kind: "other", icon: undefined, color: "#2563eb", inStock: true },
    { id: "kiwi", name: "Kiwi", kind: "other", icon: undefined, color: "#16a34a", inStock: true },
    { id: "green-apple", name: "Green Apple", kind: "other", icon: undefined, color: "#4ade80", inStock: true },
    { id: "grape", name: "Grape", kind: "other", icon: undefined, color: "#9333ea", inStock: true },
    { id: "lemon", name: "Lemon", kind: "other", icon: undefined, color: "#ca8a04", inStock: true },
    { id: "yuzu", name: "Yuzu", kind: "other", icon: undefined, color: "#facc15", inStock: true },
    { id: "mango", name: "Mango", kind: "other", icon: undefined, color: "#ea580c", inStock: true },
    { id: "chili", name: "Chili", kind: "other", icon: undefined, color: "#dc2626", inStock: true },
    { id: "mint", name: "Mint", kind: "other", icon: undefined, color: "#0891b2", inStock: true },
    { id: "coconut", name: "Coconut", kind: "other", icon: undefined, color: "#f8fafc", inStock: true },
    { id: "strawberry", name: "Strawberry", kind: "other", icon: undefined, color: "#db2777", inStock: true },
    { id: "cotton-candy", name: "Cotton Candy", kind: "other", icon: undefined, color: "#f9a8d4", inStock: true },
    { id: "pear", name: "Pear", kind: "other", icon: undefined, color: "#65a30d", inStock: true },

    // Basics screen — each is its own "ingredient" (a whole beverage, not a recipe). These render
    // in the flavor row (kind "other"), which — unlike the spirit row — didn't render
    // IngredientGlyph at all until PotionCard.tsx was updated to, so these glyphs used to be
    // unreachable regardless of icon/fallback.
    { id: "lager", name: "Lager", kind: "other", icon: "🍺", color: "#d97706", inStock: true },
    { id: "ipa", name: "IPA", kind: "other", icon: "🍺", color: "#ca8a04", inStock: true },
    { id: "cider", name: "Cider", kind: "other", icon: "🍏", color: "#65a30d", inStock: true },
    { id: "soda", name: "Soda", kind: "other", icon: "🥤", color: "#0ea5e9", inStock: true },
];

// `price` is optional per recipe and overrides the screen's shared price (see sampleScreens)
// when a particular drink costs something different, e.g. Love below (149 vs. the shared 139).
// `emblem` is embossed into the potion icon (see PotionArt) — matches reference/elixirs.jpg's
// per-potion glyphs (heart, star, skull, etc.).
export const sampleRecipes: Recipe[] = [
    {
        order: 1,
        category: "elixirs",
        name: "Health",
        emblem: "❤️",
        ingredientIds: ["vodka", "pomegranate"],
        active: true,
        price: 139,
    },
    {
        order: 2,
        category: "elixirs",
        name: "Mana",
        emblem: "⭐",
        ingredientIds: ["vodka", "blue-raspberry"],
        active: true,
        price: 139,
    },
    {
        order: 3,
        category: "elixirs",
        name: "Stamina",
        emblem: "🍃",
        ingredientIds: ["gin", "kiwi", "green-apple"],
        active: true,
        price: 139,
    },
    {
        order: 4,
        category: "elixirs",
        name: "Speed",
        emblem: "⚡",
        ingredientIds: ["gin", "lemon", "yuzu"],
        active: true,
        price: 139,
    },
    {
        order: 5,
        category: "elixirs",
        name: "Fire Resistance",
        emblem: "🔥",
        ingredientIds: ["tequila", "mango", "chili"],
        active: true,
        price: 139,
    },
    {
        order: 6,
        category: "elixirs",
        name: "Frost Resistance",
        emblem: "❄️",
        ingredientIds: ["white-rum", "mint", "coconut"],
        active: true,
        price: 139,
    },
    {
        order: 7,
        category: "elixirs",
        name: "Love",
        emblem: "💗",
        ingredientIds: ["vodka", "strawberry", "cotton-candy"],
        active: true,
        price: 149,
    },
    {
        order: 8,
        category: "elixirs",
        name: "Luck",
        emblem: "🍀",
        ingredientIds: ["gin", "pear", "grape"],
        active: true,
        price: 139,
    },
    {
        order: 1,
        category: "basics",
        name: "Lager",
        emblem: "🍺",
        ingredientIds: ["lager"],
        active: true,
        price: 79,
    },
    {
        order: 2,
        category: "basics",
        name: "IPA",
        emblem: "🍺",
        ingredientIds: ["ipa"],
        active: true,
        price: 89,
    },
    {
        order: 3,
        category: "basics",
        name: "Cider",
        emblem: "🍏",
        ingredientIds: ["cider"],
        active: true,
        price: 79,
    },
    {
        order: 4,
        category: "basics",
        name: "Prosecco",
        emblem: "🥂",
        ingredientIds: ["prosecco"],
        active: true,
        price: 99,
    },
    {
        order: 5,
        category: "basics",
        name: "Soda",
        emblem: "🥤",
        ingredientIds: ["soda"],
        active: true,
        price: 49,
    },
];

export const sampleMessages: Message[] = [
    {
        order: 1,
        text: "HAPPY HOUR FOR BEER, CIDER, WINE, SPARKLING & SODA UNTIL 23:00!",
        active: true,
        fromTime: undefined,
        toTime: "23:00",
    },
    {
        order: 2,
        text: "WELCOME TO SYNTAX ERROR!",
        active: true,
        fromTime: undefined,
        toTime: undefined,
    },
    {
        order: 3,
        text: "DON'T FORGET TO PARTICIPATE IN THE QUIZ WALK!",
        active: true,
        fromTime: undefined,
        toTime: "01:00",
    },
];

// Shown in PriceCard's top two rows ("Elixir"/"Non-alcoholic"), not per-card — see CategoryPricing.
export const sampleCategoryPricing: CategoryPricing[] = [
    {
        category: "elixirs",
        price: 139,
        nonAlcoholicPrice: 69,
    },
];

// Backs PriceCard's "basics" rows — matches sampleMessages' happy-hour banner below rather than
// the (currently inactive) "basics" Screen/Recipes.
export const samplePriceList: PriceListEntry[] = [
    { order: 1, label: "Beer", price: 74, happyHourPrice: 55, happyHourUntil: "23:00", active: true },
    { order: 2, label: "Cider", price: 72, happyHourPrice: 55, happyHourUntil: "23:00", active: true },
    { order: 3, label: "Wine", price: 98, happyHourPrice: 79, happyHourUntil: "23:00", active: true },
    { order: 4, label: "Sparkling", price: 92, happyHourPrice: 79, happyHourUntil: "23:00", active: true },
    { order: 5, label: "Soda", price: 39, happyHourPrice: 30, happyHourUntil: "23:00", active: true },
];

export const sampleScreens: Screen[] = [
    {
        order: 1,
        key: "elixirs",
        title: "Elixirs",
        subtitle: "Choose your potion",
        durationSeconds: 16,
        active: true,
        template: "elixirs",
    },
    // {
    //     order: 2,
    //     key: "basics",
    //     title: "The Basics",
    //     subtitle: "Beer · Cider · Wine · Soda",
    //     durationSeconds: 14,
    //     active: true,
    //     template: "elixirs",
    // },
];
