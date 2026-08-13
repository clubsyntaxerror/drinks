// Bitmap potion art (public/assets/potion.png, 128x128, grayscale) replaces the earlier
// hand-drawn SVG bottle. It's used three times over: as the base image (cork/neck/glass
// outline/baked-in shading, always neutral), as a mask source for a colored overlay (so the
// drink's accent color tints the bulb while keeping the source's shading — see .potion-art-tint
// in globals.css), and its own alpha silhouette clips that overlay to just the bulb so the cork
// and neck stay neutral, matching the reference image where only the liquid is colored.
//
// Measured directly from the source pixels: the neck-to-bulb transition sits at y=30 of 128
// (~23%), the outline stroke is near-black (~rgb(5,7,6)), and the bulb interior fill is a light
// gray (~rgb(238,238,238)) with a couple of baked-in highlight/shadow accents — mix-blend-mode:
// color (globals.css) preserves that shading instead of flattening the bulb to one flat tone.
const POTION_ART_SRC = "/assets/potion.png";

export function PotionArt({
    color = "#e0a83e",
    emblem,
    className,
}: {
    color?: string;
    emblem?: string;
    className?: string;
}) {
    return (
        <span className={className}>
            <img src={POTION_ART_SRC} alt="" aria-hidden="true" className="potion-art-base" />
            <span aria-hidden="true" className="potion-art-tint" style={{ backgroundColor: color }} />
            {emblem && (
                // A small SVG just for the emblem (not plain HTML text) so it scales fluidly
                // with the icon via viewBox, the same way the img/mask layers scale via percent
                // sizing — a fixed CSS font-size wouldn't track the icon shrinking under the TV
                // route's fit-to-viewport scaling. viewBox matches potion.png's own pixel grid
                // (128x128). y=84, not the bulb's 30-121 bounding-box midpoint (~76) — the
                // widest, visually "roundest" cross-section of the bulb sits lower, around
                // y=74-92, so centering there reads better than centering on the full bbox.
                <svg viewBox="0 0 128 128" className="potion-art-emblem" aria-hidden="true">
                    <text
                        x="64"
                        y="84"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="34"
                        opacity="0.9"
                        style={{ WebkitTextStroke: "2px #1a1206" }}
                    >
                        {emblem}
                    </text>
                </svg>
            )}
            {/* Specular highlight: a plain radial-gradient white blob, masked to the same bulb
                silhouette, sitting above the emblem so the "glass" reads as glinting over
                everything beneath it rather than the color/emblem sitting on top of the shine. */}
            <span aria-hidden="true" className="potion-art-shine" />
        </span>
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
