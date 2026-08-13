import { useId } from "react";

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

const EMBLEM_X = 64;
const EMBLEM_Y = 84;
const EMBLEM_FONT_SIZE = 28;

export function PotionArt({
    color = "#e0a83e",
    emblem,
    className,
}: {
    color?: string;
    emblem?: string;
    className?: string;
}) {
    const emblemClipId = useId();
    const emblemMosaicId = useId();

    return (
        <span className={className}>
            <img src={POTION_ART_SRC} alt="" aria-hidden="true" className="potion-art-base" />
            {/* Pre-darkens the fill area before the tint blends against it — see the long
                comment on .potion-art-fill-shade in globals.css for why: overlay's "maximum
                tint" only happens near 50% gray, and the bulb's flat interior sits at ~93%
                white, so without this the tint stayed washed out no matter how saturated the
                accent color was. */}
            <span aria-hidden="true" className="potion-art-fill-shade" />
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
                    <defs>
                        {/* SVG text can itself be a clipPath source — a second copy of the same
                            glyph, used below to shape the color overlay to exactly the emblem's
                            silhouette rather than a rectangle. */}
                        <clipPath id={emblemClipId}>
                            <text
                                x={EMBLEM_X}
                                y={EMBLEM_Y}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize={EMBLEM_FONT_SIZE}
                            >
                                {emblem}
                            </text>
                        </clipPath>
                        {/* A grid of small squares with gaps, instead of a flat fill, so the
                            color overlay itself reads as a chunky pixel/mosaic tint rather than
                            smooth vector color — matching the rest of the site's pixel-art look
                            instead of looking anti-aliased next to it. patternUnits is in the
                            same 128x128 user-space as everything else here. Squares cover 3.4 of
                            each 4-unit tile (85%, thin gaps) rather than half-and-half, so more
                            of the glyph actually gets the color blend and less shows through
                            untinted — reads as a stronger, more saturated tint overall. */}
                        <pattern id={emblemMosaicId} width="4" height="4" patternUnits="userSpaceOnUse">
                            <rect x="0" y="0" width="3.4" height="3.4" fill={color} />
                        </pattern>
                    </defs>
                    <text
                        x={EMBLEM_X}
                        y={EMBLEM_Y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={EMBLEM_FONT_SIZE}
                        opacity="0.9"
                        style={{ WebkitTextStroke: "2px #1a1206" }}
                    >
                        {emblem}
                    </text>
                    {/* Tints the emblem toward the drink's accent color. mix-blend-mode: color
                        takes the pattern's hue/saturation but keeps the emoji's own luminosity at
                        each pixel (the backdrop, painted just above) — so it stays visible and
                        properly shaded even for very dark accent colors, unlike a flat fill
                        would. Clipped to the glyph shape above so only the emblem is tinted. */}
                    <rect
                        x="0"
                        y="0"
                        width="128"
                        height="128"
                        fill={`url(#${emblemMosaicId})`}
                        clipPath={`url(#${emblemClipId})`}
                        className="potion-art-emblem-tint"
                    />
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
