// No bundled potion/spirit art exists yet (see spec.md §10/§12) — these are lightweight,
// dependency-free placeholders (inline SVG + emoji) that key off sheet data so the menu is
// fully functional today and swappable for bespoke pixel art later without a data model change.
import { useId } from "react";

const BULB_PATH =
    "M8.5 8 H15.5 V11.5 C19 13.5 21 17 21 20.5 C21 25.5 16.97 29 12 29 C7.03 29 3 25.5 3 20.5 C3 17 5 13.5 8.5 11.5 Z";

export function PotionIcon({
    color = "#e0a83e",
    emblem,
    className,
}: {
    color?: string;
    emblem?: string;
    className?: string;
}) {
    const uid = useId();
    const clipId = `${uid}-clip`;
    const glossId = `${uid}-gloss`;
    const outlineId = `${uid}-outline`;

    return (
        <svg viewBox="0 0 24 30" className={className} aria-hidden="true">
            <defs>
                <clipPath id={clipId}>
                    <path d={BULB_PATH} />
                </clipPath>
                {/* Off-center radial gradient rather than a single flat tone, so the highlight
                    reads as a rounded glass sheen (bright core fading smoothly out) instead of
                    a uniformly-opaque blob. */}
                <radialGradient id={glossId} cx="32%" cy="28%" r="70%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
                    <stop offset="45%" stopColor="#ffffff" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
                {/* Horizontal gradient so the outline itself catches the light on the same side
                    as the gloss (left) and fades back to a plain dark edge on the right. */}
                <linearGradient id={outlineId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fff3d6" />
                    <stop offset="50%" stopColor="#8a7454" />
                    <stop offset="100%" stopColor="#1a1206" />
                </linearGradient>
            </defs>
            {/* cork */}
            <rect x="9" y="0.5" width="6" height="4" rx="1.4" fill="#e3c17a" stroke="#241a0c" strokeWidth="0.8" />
            {/* neck/collar */}
            <rect x="8.5" y="4.6" width="7" height="3.4" rx="0.6" fill="#9aa0ab" stroke="#241a0c" strokeWidth="0.6" />
            {/* glass bulb, empty by default so the fill below can stop short of the neck */}
            <path d={BULB_PATH} fill="rgba(255,255,255,0.06)" stroke={`url(#${outlineId})`} strokeWidth="1.4" />
            {/* liquid fill: clipped to the bulb and starting a few units below the neck, so the
                bottle reads as not-quite-full instead of solid color all the way to the cork */}
            <rect x="1" y="12.5" width="22" height="17" fill={color} clipPath={`url(#${clipId})`} />
            {/* emblem embossed into the liquid surface, sitting under the gloss highlight so the
                shine still reads as glinting over the top of it. Color emoji glyphs ignore
                fill/stroke (the OS font renders them as fixed-color images), so a dark rim
                comes from -webkit-text-stroke instead — that outlines the glyph's rendered
                shape rather than trying to recolor it, which is why it works here. */}
            {emblem && (
                <text
                    x="12"
                    y="20.5"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="8.5"
                    opacity="0.9"
                    style={{ WebkitTextStroke: "0.5px #1a1206" }}
                    clipPath={`url(#${clipId})`}
                >
                    {emblem}
                </text>
            )}
            {/* glossy highlight over the round base of the bulb */}
            <circle cx="9" cy="19" r="7" fill={`url(#${glossId})`} clipPath={`url(#${clipId})`} />
        </svg>
    );
}

// A "crossed out" overlay for out-of-stock cards — the ❌ emoji rather than a hand-drawn path.
// It's already a bold red X in every emoji font (Twemoji/Noto/Apple all render it with rounded,
// marker-like strokes), so no fill/stroke tricks are needed here, unlike the embossed emblem
// above. viewBox matches .potion-card's own 3:4 aspect ratio so it maps 1:1 with no distortion.
export function OutOfStockCross({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 75 100" className={className} aria-hidden="true">
            <text x="37.5" y="50" textAnchor="middle" dominantBaseline="central" fontSize="35">
                ❌
            </text>
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
