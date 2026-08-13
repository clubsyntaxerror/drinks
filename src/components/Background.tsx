// Pure CSS flicker background (see spec.md §7). No video, no JS animation loop — the flicker
// is opacity/transform keyframes, cheap enough for weak TV browsers and automatically disabled
// under prefers-reduced-motion (globals.css).
//
// `image` is optional: without it this is just the CSS gradient/tint (mobile route, or any
// template — e.g. Drinks — that doesn't have bespoke photo art yet). With it, the photo sits
// underneath as the base layer, the same vignette gradient renders on top as a translucent
// tint/filter, and (for the "dungeon" theme only) torches flicker above both.
//
// `theme` picks the color mood and whether torches render at all — "arcade" (Drinks) has no
// torches: they're a dungeon-specific prop, not a generic decoration. `scoped` switches from
// viewport-fixed (the TV route, where .tv-stage already fills the screen so a plain `fixed`
// layer is simplest) to absolutely positioned within the nearest positioned ancestor (the
// mobile route, where every screen stacks on one scrolling page and each needs its own
// section-local background instead of one global fixed layer — see .menu-screen).
export default function Background({
    image,
    theme = "dungeon",
    scoped = false,
}: {
    image?: string;
    theme?: "dungeon" | "arcade";
    scoped?: boolean;
}) {
    return (
        <div
            className={`menu-background menu-background-${theme}${scoped ? " menu-background-scoped" : ""}`}
            aria-hidden="true"
        >
            {image && <div className="menu-background-photo" style={{ backgroundImage: `url(${image})` }} />}
            <div className="menu-background-filter" />
            {theme === "dungeon" && (
                <>
                    {/* Hand-aligned to public/assets/background.jpg's own painted torches: a
                        bright near pair on the front columns, and a smaller, dimmer far pair
                        receding toward the corridor's vanishing point. Purely decorative glows
                        without an image — position doesn't matter much there, so the same
                        layout is reused. */}
                    <div className="torch torch-front torch-front-left" />
                    <div className="torch torch-front torch-front-right" />
                    <div className="torch torch-back torch-back-left" />
                    <div className="torch torch-back torch-back-right" />
                </>
            )}
        </div>
    );
}
