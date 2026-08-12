import type { CSSProperties } from "react";
import { PotionIcon, IngredientGlyph } from "./icons";
import type { Item } from "../app/drinksData";

export default function PotionCard({ item, index }: { item: Item; index: number }) {
    return (
        <article
            className={`potion-card${item.outOfStock ? " out-of-stock" : ""}`}
            style={{ "--accent": item.accentColor } as CSSProperties}
        >
            <span className="potion-index">{String(index + 1).padStart(2, "0")}</span>
            <div className="potion-icon-wrap">
                <PotionIcon color={item.accentColor} className="potion-icon" />
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
                                <IngredientGlyph ingredient={spirit} /> {spirit.name}
                            </span>
                        ))}
                    </p>
                )}
            </div>
            {item.outOfStock && <div className="out-of-stock-cross" aria-hidden="true" />}
        </article>
    );
}
