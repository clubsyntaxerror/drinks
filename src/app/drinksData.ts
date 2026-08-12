import { cache } from "react";
import { getSheetRows } from "./sheets";
import { sampleIngredients, sampleRecipes, sampleMessages, sampleScreens } from "./sampleData";

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
    ingredientIds: string[];
    tag: string | undefined;
    active: boolean;
};

// A Recipe with its ingredient ids resolved against the Ingredients tab. This is what
// components actually render.
export type Item = {
    order: number;
    category: string;
    name: string;
    spirits: Ingredient[];
    flavors: Ingredient[]; // every non-spirit ingredient (fruit, mixer, garnish, or a Basics beverage)
    accentColor: string;
    tag: string | undefined;
    active: boolean;
    outOfStock: boolean; // true if any composing ingredient is marked out of stock
};

export type Message = {
    order: number;
    text: string;
    active: boolean;
};

export type Screen = {
    order: number;
    key: string; // matches Item.category
    title: string;
    subtitle: string | undefined;
    price: string | undefined; // one price for everything on this screen, e.g. "139 kr" — not per-drink
    durationSeconds: number;
    active: boolean;
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
            order: recipe.order,
            category: recipe.category,
            name: recipe.name,
            spirits,
            flavors,
            accentColor: flavors[0]?.color ?? spirits[0]?.color ?? "#e0a83e",
            tag: recipe.tag,
            active: recipe.active,
            outOfStock: resolved.some((ingredient) => !ingredient.inStock),
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
                        ingredientIds: (row[3] ?? "")
                            .split(",")
                            .map((id) => id.trim())
                            .filter(Boolean),
                        tag: row[4] || undefined,
                        active: isTruthy(row[5]),
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
                        price: row[4] || undefined,
                        durationSeconds: Number(row[5]) || 14,
                        active: isTruthy(row[6]),
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
    isSampleData: boolean;
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
            isSampleData: true,
        };
    }

    return { items: composeRecipes(recipes, ingredients), messages, screens, isSampleData: false };
});
