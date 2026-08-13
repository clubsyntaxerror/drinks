import type { CSSProperties } from "react";
import { PotionArt, IngredientGlyph, OutOfStockCross } from "./icons";
import { withMinLightness } from "./utils/color";
import type { Item } from "../app/drinksData";

export default function PotionCard({ item, index }: { item: Item; index: number }) {
    return (
        <article
            className={`potion-card${item.outOfStock ? " out-of-stock" : ""}`}
            style={
                {
                    "--accent": item.accentColor,
                    // The potion icon's tint can use the true accentColor (it has baked-in
                    // shading to fall back on for contrast, per PotionArt), but flat name text
                    // with a near-black accent (e.g. Shadow Potion) has nothing else to keep it
                    // readable — clamp its lightness up instead.
                    "--name-color": withMinLightness(item.accentColor, 50),
                } as CSSProperties
            }
        >
            {/* Tints the (otherwise neutral-gray) frame.png border warm gold, with an animated
                specular glint sweeping across it — see globals.css for how the mask/blend work. */}
            <span aria-hidden="true" className="potion-card-frame-shine" />
            <span className="potion-index">{String(index + 1).padStart(2, "0")}</span>
            {item.price !== undefined && <span className="potion-price">{item.price}:-</span>}
            <div className="potion-icon-wrap">
                <PotionArt color={item.accentColor} emblem={item.emblem} className="potion-icon" />
            </div>
            <div className="potion-body">
                <h3 className="potion-name">{item.name}</h3>
                {item.flavors.length > 0 && (
                    <p className="potion-flavor">{item.flavors.map((flavor) => flavor.name).join(" & ")}</p>
                )}
                {item.spirits.length > 0 && (
                    <p className="potion-base">
                        {item.spirits.map((spirit, i) => (
                            <span key={spirit.id}>
                                {i > 0 && " & "}
                                <IngredientGlyph ingredient={spirit} />
                                {spirit.name}
                            </span>
                        ))}
                    </p>
                )}
            </div>
            {item.outOfStock && <OutOfStockCross className="out-of-stock-cross" />}
        </article>
    );
}
