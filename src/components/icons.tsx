// No bundled potion/spirit art exists yet (see spec.md §10/§12) — these are lightweight,
// dependency-free placeholders (inline SVG + emoji) that key off sheet data so the menu is
// fully functional today and swappable for bespoke pixel art later without a data model change.
import { useId } from "react";

const BULB_PATH =
    "M8.5 8 H15.5 V11.5 C19 13.5 21 17 21 20.5 C21 25.5 16.97 29 12 29 C7.03 29 3 25.5 3 20.5 C3 17 5 13.5 8.5 11.5 Z";

export function PotionIcon({ color = "#e0a83e", className }: { color?: string; className?: string }) {
    const clipId = useId();

    return (
        <svg viewBox="0 0 24 30" className={className} aria-hidden="true">
            {/* cork */}
            <rect x="9" y="0.5" width="6" height="4" rx="1.4" fill="#e3c17a" stroke="#241a0c" strokeWidth="0.8" />
            {/* neck/collar */}
            <rect x="8.5" y="4.6" width="7" height="3.4" rx="0.6" fill="#9aa0ab" stroke="#241a0c" strokeWidth="0.6" />
            {/* glass bulb, empty by default so the fill below can stop short of the neck */}
            <path d={BULB_PATH} fill="rgba(255,255,255,0.06)" stroke="#1a1206" strokeWidth="1.2" />
            <clipPath id={clipId}>
                <path d={BULB_PATH} />
            </clipPath>
            {/* liquid fill: clipped to the bulb and starting a few units below the neck, so the
                bottle reads as not-quite-full instead of solid color all the way to the cork */}
            <rect x="1" y="12.5" width="22" height="17" fill={color} clipPath={`url(#${clipId})`} />
            <ellipse cx="9.5" cy="19" rx="2.2" ry="3" fill="#ffffff" opacity="0.18" />
        </svg>
    );
}

const INGREDIENT_GLYPHS: Record<string, string> = {
    vodka: "🍾",
    gin: "🌿",
    tequila: "🌵",
    rum: "🌴",
    whisk: "🥃", // matches whisky/whiskey
    wine: "🍷",
    sparkling: "🥂",
    champagne: "🥂",
    beer: "🍺",
    lager: "🍺",
    ipa: "🍺",
    cider: "🍏",
    soda: "🥤",
};

// An Ingredient's own `icon` column can hold an explicit emoji/glyph; otherwise this falls
// back to a keyword match on its name so common spirits get a sensible glyph for free.
export function IngredientGlyph({ ingredient }: { ingredient: { name: string; icon?: string } }) {
    if (ingredient.icon) {
        return (
            <span aria-hidden="true" className="ingredient-glyph">
                {ingredient.icon}
            </span>
        );
    }

    const key = ingredient.name.toLowerCase();
    const match = Object.entries(INGREDIENT_GLYPHS).find(([needle]) => key.includes(needle));

    if (!match) {
        return null;
    }

    return (
        <span aria-hidden="true" className="ingredient-glyph">
            {match[1]}
        </span>
    );
}
