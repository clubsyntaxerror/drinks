// Placeholder content shown when the Google Sheet isn't configured yet (no env vars) or is
// reachable but empty. Lets `npm run dev` render a real-looking menu before the spreadsheet
// exists. Swapped out automatically the moment the sheet returns real rows — see getMenuData().
//
// "coconut" is deliberately marked out of stock below, so Frost Resistance Potion renders
// crossed-out on first run — a live demo of the inventory cascade, not a mistake.
import type { Ingredient, Recipe, Message, Screen } from "./drinksData";

export const sampleIngredients: Ingredient[] = [
    // Spirits
    { id: "vodka", name: "Vodka", kind: "spirit", icon: undefined, color: "#cbd5e1", inStock: true },
    { id: "gin", name: "Gin", kind: "spirit", icon: undefined, color: "#4ade80", inStock: true },
    { id: "tequila", name: "Tequila", kind: "spirit", icon: undefined, color: "#eab308", inStock: true },
    { id: "white-rum", name: "White Rum", kind: "spirit", icon: undefined, color: "#38bdf8", inStock: true },
    { id: "whiskey", name: "Whiskey", kind: "spirit", icon: undefined, color: "#b45309", inStock: true },

    // Elixir flavor ingredients
    { id: "pomegranate", name: "Pomegranate", kind: "other", icon: undefined, color: "#dc2626", inStock: true },
    { id: "blue-raspberry", name: "Blue Raspberry", kind: "other", icon: undefined, color: "#2563eb", inStock: true },
    { id: "kiwi", name: "Kiwi", kind: "other", icon: undefined, color: "#16a34a", inStock: true },
    { id: "green-apple", name: "Green Apple", kind: "other", icon: undefined, color: "#4ade80", inStock: true },
    { id: "grape", name: "Grape", kind: "other", icon: undefined, color: "#9333ea", inStock: true },
    { id: "blackberry", name: "Blackberry", kind: "other", icon: undefined, color: "#581c87", inStock: true },
    { id: "lemon", name: "Lemon", kind: "other", icon: undefined, color: "#ca8a04", inStock: true },
    { id: "yuzu", name: "Yuzu", kind: "other", icon: undefined, color: "#facc15", inStock: true },
    { id: "mango", name: "Mango", kind: "other", icon: undefined, color: "#ea580c", inStock: true },
    { id: "chili", name: "Chili", kind: "other", icon: undefined, color: "#dc2626", inStock: true },
    { id: "mint", name: "Mint", kind: "other", icon: undefined, color: "#0891b2", inStock: true },
    { id: "coconut", name: "Coconut", kind: "other", icon: undefined, color: "#f8fafc", inStock: false },
    { id: "licorice", name: "Licorice", kind: "other", icon: undefined, color: "#6d28d9", inStock: true },
    { id: "raspberry", name: "Raspberry", kind: "other", icon: undefined, color: "#be123c", inStock: true },
    { id: "strawberry", name: "Strawberry", kind: "other", icon: undefined, color: "#db2777", inStock: true },
    { id: "cotton-candy", name: "Cotton Candy", kind: "other", icon: undefined, color: "#f9a8d4", inStock: true },
    { id: "pear", name: "Pear", kind: "other", icon: undefined, color: "#65a30d", inStock: true },

    // Drinks-screen flavor ingredients
    { id: "orange", name: "Orange", kind: "other", icon: undefined, color: "#ea580c", inStock: true },
    { id: "bitters", name: "Angostura Bitters", kind: "other", icon: undefined, color: "#78350f", inStock: true },
    { id: "coffee", name: "Coffee", kind: "other", icon: undefined, color: "#78350f", inStock: true },
    { id: "vanilla", name: "Vanilla", kind: "other", icon: undefined, color: "#fef3c7", inStock: true },
    { id: "lime", name: "Lime", kind: "other", icon: undefined, color: "#65a30d", inStock: true },
    { id: "bitter-orange", name: "Bitter Orange", kind: "other", icon: undefined, color: "#b91c1c", inStock: true },

    // Basics screen — each is its own "ingredient" (a whole beverage, not a recipe)
    { id: "lager", name: "Lager", kind: "other", icon: undefined, color: "#d97706", inStock: true },
    { id: "ipa", name: "IPA", kind: "other", icon: undefined, color: "#ca8a04", inStock: true },
    { id: "cider", name: "Cider", kind: "other", icon: undefined, color: "#65a30d", inStock: true },
    { id: "prosecco", name: "Prosecco", kind: "other", icon: undefined, color: "#eab308", inStock: true },
    { id: "soda", name: "Soda", kind: "other", icon: undefined, color: "#0ea5e9", inStock: true },
];

// No `price` per recipe — pricing is one value per screen (see sampleScreens), not per drink.
export const sampleRecipes: Recipe[] = [
    {
        order: 1,
        category: "elixirs",
        name: "Health Potion",
        ingredientIds: ["vodka", "pomegranate"],
        tag: undefined,
        active: true,
    },
    {
        order: 2,
        category: "elixirs",
        name: "Mana Potion",
        ingredientIds: ["vodka", "blue-raspberry"],
        tag: undefined,
        active: true,
    },
    {
        order: 3,
        category: "elixirs",
        name: "Stamina Potion",
        ingredientIds: ["gin", "kiwi", "green-apple"],
        tag: undefined,
        active: true,
    },
    {
        order: 4,
        category: "elixirs",
        name: "Poison",
        ingredientIds: ["vodka", "grape", "blackberry"],
        tag: undefined,
        active: true,
    },
    {
        order: 5,
        category: "elixirs",
        name: "Speed Potion",
        ingredientIds: ["gin", "lemon", "yuzu"],
        tag: undefined,
        active: true,
    },
    {
        order: 6,
        category: "elixirs",
        name: "Fire Resistance Potion",
        ingredientIds: ["tequila", "mango", "chili"],
        tag: undefined,
        active: true,
    },
    {
        order: 7,
        category: "elixirs",
        name: "Frost Resistance Potion",
        ingredientIds: ["white-rum", "mint", "coconut"],
        tag: undefined,
        active: true,
    },
    {
        order: 8,
        category: "elixirs",
        name: "Shadow Potion",
        ingredientIds: ["vodka", "licorice", "raspberry"],
        tag: undefined,
        active: true,
    },
    {
        order: 9,
        category: "elixirs",
        name: "Love Potion",
        ingredientIds: ["vodka", "strawberry", "cotton-candy"],
        tag: "new",
        active: true,
    },
    {
        order: 10,
        category: "elixirs",
        name: "Luck Potion",
        ingredientIds: ["gin", "pear", "grape"],
        tag: undefined,
        active: true,
    },
    {
        order: 1,
        category: "drinks",
        name: "Old Fashioned",
        ingredientIds: ["whiskey", "orange", "bitters"],
        tag: undefined,
        active: true,
    },
    {
        order: 2,
        category: "drinks",
        name: "Espresso Martini",
        ingredientIds: ["vodka", "coffee", "vanilla"],
        tag: undefined,
        active: true,
    },
    {
        order: 3,
        category: "drinks",
        name: "Mojito",
        ingredientIds: ["white-rum", "lime", "mint"],
        tag: undefined,
        active: true,
    },
    {
        order: 4,
        category: "drinks",
        name: "Negroni",
        ingredientIds: ["gin", "bitter-orange"],
        tag: undefined,
        active: true,
    },
    { order: 1, category: "basics", name: "Lager", ingredientIds: ["lager"], tag: undefined, active: true },
    { order: 2, category: "basics", name: "IPA", ingredientIds: ["ipa"], tag: undefined, active: true },
    { order: 3, category: "basics", name: "Cider", ingredientIds: ["cider"], tag: undefined, active: true },
    { order: 4, category: "basics", name: "Prosecco", ingredientIds: ["prosecco"], tag: undefined, active: true },
    { order: 5, category: "basics", name: "Soda", ingredientIds: ["soda"], tag: undefined, active: true },
];

export const sampleMessages: Message[] = [
    { order: 1, text: "New arcade cabinet now live upstairs!", active: true },
    { order: 2, text: "Happy hour 18:00–20:00 — 20% off all Elixirs", active: true },
    { order: 3, text: "Ask your bartender about tonight's secret menu item", active: true },
];

export const sampleScreens: Screen[] = [
    {
        order: 1,
        key: "elixirs",
        title: "Elixirs",
        subtitle: "Choose your potion",
        price: "139 kr",
        durationSeconds: 14,
        active: true,
    },
    // {
    //     order: 2,
    //     key: "drinks",
    //     title: "Drinks",
    //     subtitle: "Classic & signature",
    //     price: "149 kr",
    //     durationSeconds: 14,
    //     active: true,
    // },
    // {
    //     order: 3,
    //     key: "basics",
    //     title: "The Basics",
    //     subtitle: "Beer · Cider · Wine · Soda",
    //     price: "79 kr",
    //     durationSeconds: 14,
    //     active: true,
    // },
];
