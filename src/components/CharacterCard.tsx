import type { CSSProperties } from "react";
import { IngredientGlyph, OutOfStockCross } from "./icons";
import { withMinLightness } from "./utils/color";
import type { Item } from "../app/drinksData";

// WIP placeholder for the Drinks "character select" template (see spec.md/README): stands in
// for real character-portrait art. `emblem` is already the character glyph each drink is
// themed after (👑 Peach Cocktail, 🧛 Lady Dimitrescu, ...), so it doubles as a portrait here —
// no new data needed once real art exists, just swap the portrait rendering below for it.
export default function CharacterCard({ item, index }: { item: Item; index: number }) {
    return (
        <article
            className={`character-card${item.outOfStock ? " out-of-stock" : ""}`}
            style={
                {
                    "--accent": item.accentColor,
                    "--name-color": withMinLightness(item.accentColor, 50),
                } as CSSProperties
            }
        >
            <span className="character-index">{String(index + 1).padStart(2, "0")}</span>
            {item.price !== undefined && <span className="character-price">{item.price}:-</span>}
            <div className="character-portrait" aria-hidden="true">
                {item.emblem ?? "❔"}
            </div>
            <div className="character-info">
                <h3 className="character-name">{item.name}</h3>
                {item.flavors.length > 0 && (
                    <p className="character-caption">{item.flavors.map((flavor) => flavor.name).join(" · ")}</p>
                )}
                {item.spirits.length > 0 && (
                    <p className="character-base">
                        {item.spirits.map((spirit, i) => (
                            <span key={spirit.id}>
                                {i > 0 && " "}
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
