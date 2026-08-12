// Pure CSS torch-flicker background (see spec.md §7). No video, no JS animation loop — the
// flicker is opacity/transform keyframes, cheap enough for weak TV browsers and automatically
// disabled under prefers-reduced-motion (globals.css).
//
// `image` is optional: without it this is just the dark stone-brick gradient (mobile route).
// With it (the TV route), the photo sits underneath as the base layer, the same brick/vignette
// gradient renders on top as a translucent tint/filter, and the torches flicker above both.
export default function Background({ image }: { image?: string }) {
    return (
        <div className="menu-background" aria-hidden="true">
            {image && <div className="menu-background-photo" style={{ backgroundImage: `url(${image})` }} />}
            <div className="menu-background-filter" />
            <div className="torch torch-left" />
            <div className="torch torch-right" />
        </div>
    );
}
