import { cache } from "react";
import { getSheetRows } from "./sheets";
import { sampleIngredients, sampleRecipes, sampleMessages, sampleScreens } from "./sampleData";
import { TEMPLATE_KEYS, DEFAULT_TEMPLATE_KEY, type TemplateKey } from "./templateKeys";

export const revalidate = 120;

// A single stockable thing — a spirit or anything else that goes into a drink (fruit, syrup,
// garnish, or even a whole beverage like "Lager" for the Basics screen). This is the one place
// an image reference and in-stock state live; Recipes just point at ids here.
export type Ingredient = {
    id: string;
    name: string;
    kind: "spirit" | "other";
    icon: string | undefined; // glyph/key for components/icons.tsx, falls back to nothing
    color: string | undefined; // contributes to a composed drink's accent color
    inStock: boolean;
};

// A drink/elixir/basic as staff enter it in the sheet — just a name and a list of ingredient
// ids. Everything visual (icons, accent color, out-of-stock state) is derived, not entered.
export type Recipe = {
    order: number;
    category: string; // free text, matches a Screen.key — not a hardcoded enum
    name: string;
    emblem: string | undefined; // an emoji embossed into the potion icon, e.g. "❤️" for Health Potion
    ingredientIds: string[];
    active: boolean;
    price: number | undefined; // overrides the screen's shared price for this one drink, e.g. 139
};

// A Recipe with its ingredient ids resolved against the Ingredients tab. This is what
// components actually render. Recipe's `order`/`active` don't carry over — getRecipes() has
// already sorted and filtered by them before composeRecipes() runs, so nothing downstream
// needs them again.
export type Item = {
    category: string;
    name: string;
    emblem: string | undefined;
    spirits: Ingredient[];
    flavors: Ingredient[]; // every non-spirit ingredient (fruit, mixer, garnish, or a Basics beverage)
    accentColor: string;
    outOfStock: boolean; // true if any composing ingredient is marked out of stock
    price: number | undefined;
};

export type Message = {
    order: number;
    text: string;
    active: boolean;
    fromTime: string | undefined; // "HH:MM" — message only shows from this time onward (see isWithinDailyWindow)
    toTime: string | undefined; // "HH:MM" — message stops showing at this time
};

// TEMPLATE_KEYS/DEFAULT_TEMPLATE_KEY live in ./templateKeys, not here, so that
// components/templates.ts (imported by the client-side ScreenCarousel) can use
// DEFAULT_TEMPLATE_KEY without pulling this module's server-only ./sheets/googleapis
// dependency into the browser bundle. See that file for why.
function resolveTemplateKey(value: string | undefined): TemplateKey {
    const key = (value ?? "").trim().toLowerCase();
    return (TEMPLATE_KEYS as readonly string[]).includes(key) ? (key as TemplateKey) : DEFAULT_TEMPLATE_KEY;
}

export type Screen = {
    order: number;
    key: string; // matches Item.category
    title: string;
    subtitle: string | undefined;
    durationSeconds: number;
    active: boolean;
    template: TemplateKey; // which visual template this screen renders as — see TEMPLATE_KEYS above
};

function isTruthy(value: string | undefined) {
    return (value ?? "true").trim().toLowerCase() === "true";
}

// Resolves each Recipe's ingredientIds against the Ingredients inventory and derives everything
// the UI needs to render a card: which row ingredients go in (spirit vs flavor), an accent
// color, and whether the drink is out of stock because something in it is. This is the whole
// "inventory system" behind the menu — mark one ingredient out of stock here and every drink
// that uses it goes crossed-out automatically, nothing to update per-drink.
export function composeRecipes(recipes: Recipe[], ingredients: Ingredient[]): Item[] {
    const byId = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));

    return recipes.map((recipe) => {
        const resolved: Ingredient[] = [];
        for (const id of recipe.ingredientIds) {
            const ingredient = byId.get(id);
            if (ingredient) {
                resolved.push(ingredient);
            } else {
                console.log(`Recipe "${recipe.name}" references unknown ingredient id "${id}"`);
            }
        }

        const spirits = resolved.filter((ingredient) => ingredient.kind === "spirit");
        const flavors = resolved.filter((ingredient) => ingredient.kind !== "spirit");

        return {
            category: recipe.category,
            name: recipe.name,
            emblem: recipe.emblem,
            spirits,
            flavors,
            accentColor: flavors[0]?.color ?? spirits[0]?.color ?? "#e0a83e",
            outOfStock: resolved.some((ingredient) => !ingredient.inStock),
            price: recipe.price,
        } satisfies Item;
    });
}

export const getIngredients = cache(async (): Promise<Ingredient[]> => {
    try {
        const rows = await getSheetRows("Ingredients");
        return rows
            .slice(1) // skip header row
            .map(
                (row) =>
                    ({
                        id: (row[0] ?? "").trim(),
                        name: row[1] ?? "",
                        kind: (row[2] ?? "").trim().toLowerCase() === "spirit" ? "spirit" : "other",
                        icon: row[3] || undefined,
                        color: row[4] || undefined,
                        inStock: isTruthy(row[5]),
                    }) satisfies Ingredient,
            )
            .filter((ingredient) => ingredient.id && ingredient.name);
    } catch (err) {
        console.log(err);
        return [];
    }
});

export const getRecipes = cache(async (): Promise<Recipe[]> => {
    try {
        const rows = await getSheetRows("Items");
        return rows
            .slice(1)
            .map(
                (row) =>
                    ({
                        order: Number(row[0]) || 0,
                        category: (row[1] ?? "").trim(),
                        name: row[2] ?? "",
                        emblem: row[3] || undefined,
                        ingredientIds: (row[4] ?? "")
                            .split(",")
                            .map((id) => id.trim())
                            .filter(Boolean),
                        active: isTruthy(row[5]),
                        price: row[6] ? Number(row[6]) || undefined : undefined,
                    }) satisfies Recipe,
            )
            .filter((recipe) => recipe.active && recipe.name)
            .sort((a, b) => a.order - b.order);
    } catch (err) {
        console.log(err);
        return [];
    }
});

export const getMessages = cache(async (): Promise<Message[]> => {
    try {
        const rows = await getSheetRows("Messages");
        return rows
            .slice(1)
            .map(
                (row) =>
                    ({
                        order: Number(row[0]) || 0,
                        text: row[1] ?? "",
                        active: isTruthy(row[2]),
                        fromTime: row[3] || undefined,
                        toTime: row[4] || undefined,
                    }) satisfies Message,
            )
            .filter((message) => message.active && message.text)
            .sort((a, b) => a.order - b.order);
    } catch (err) {
        console.log(err);
        return [];
    }
});

export const getScreens = cache(async (): Promise<Screen[]> => {
    try {
        const rows = await getSheetRows("Screens");
        return rows
            .slice(1)
            .map(
                (row) =>
                    ({
                        order: Number(row[0]) || 0,
                        key: (row[1] ?? "").trim(),
                        title: row[2] ?? "",
                        subtitle: row[3] || undefined,
                        durationSeconds: Number(row[4]) || 14,
                        active: isTruthy(row[5]),
                        template: resolveTemplateKey(row[6]),
                    }) satisfies Screen,
            )
            .filter((screen) => screen.active && screen.key)
            .sort((a, b) => a.order - b.order);
    } catch (err) {
        console.log(err);
        return [];
    }
});

export type MenuData = {
    items: Item[];
    messages: Message[];
    screens: Screen[];
};

// Aggregates every tab for a route in one call. Falls back to bundled sample content when the
// spreadsheet isn't reachable/configured yet or is simply still empty, so the site always
// renders something meaningful instead of a blank menu.
export const getMenuData = cache(async (): Promise<MenuData> => {
    const [recipes, ingredients, messages, screens] = await Promise.all([
        getRecipes(),
        getIngredients(),
        getMessages(),
        getScreens(),
    ]);

    if (recipes.length === 0 && screens.length === 0) {
        return {
            items: composeRecipes(sampleRecipes, sampleIngredients),
            messages: sampleMessages,
            screens: sampleScreens,
        };
    }

    return { items: composeRecipes(recipes, ingredients), messages, screens };
});
