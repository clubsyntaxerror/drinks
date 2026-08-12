// Pure CSS torch-flicker background (see spec.md §7). No video, no JS animation loop — the
// flicker is opacity/transform keyframes, cheap enough for weak TV browsers and automatically
// disabled under prefers-reduced-motion (globals.css).
//
// `image` is optional: without it this is just the dark stone-brick gradient (mobile route).
// With it (the TV route), the photo sits underneath as the base layer, the same brick/vignette
// gradient renders on top as a translucent tint/filter, and the torches flicker above both.
//
// The four torch positions below are hand-aligned to public/assets/background.jpg's own
// painted torches: a bright near pair on the front columns, and a smaller, dimmer far pair
// receding toward the corridor's vanishing point. Purely decorative glows without an image
// (mobile) — position doesn't matter much there, so the same layout is reused.
export default function Background({ image }: { image?: string }) {
    return (
        <div className="menu-background" aria-hidden="true">
            {image && <div className="menu-background-photo" style={{ backgroundImage: `url(${image})` }} />}
            <div className="menu-background-filter" />
            <div className="torch torch-front torch-front-left" />
            <div className="torch torch-front torch-front-right" />
            <div className="torch torch-back torch-back-left" />
            <div className="torch torch-back torch-back-right" />
        </div>
    );
}
