"use client";

import { useRef, type CSSProperties } from "react";
import { useFitToViewport, useBalancedColumns } from "./utils/hooks";
import PotionCard from "./PotionCard";
import type { Item } from "../app/drinksData";

// Cards are sized around .potion-card in globals.css — kept in sync here so the column-
// balancing math (useBalancedColumns) agrees with how a row actually lays out.
const MIN_CARD_WIDTH_PX = 176; // 11rem
const GRID_GAP_PX = 16; // 1rem

// `fitToViewport` is only turned on by the TV route: it scales the grid down (never up) so
// it always fits the screen without scrolling, whatever the item count. The mobile route
// leaves it off and just lets the grid wrap/scroll normally.
export default function MenuGrid({ items, fitToViewport = false }: { items: Item[]; fitToViewport?: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const scale = useFitToViewport(containerRef, contentRef, fitToViewport);
    const columns = useBalancedColumns(containerRef, items.length, MIN_CARD_WIDTH_PX, GRID_GAP_PX);

    if (items.length === 0) {
        return null;
    }

    return (
        <div ref={containerRef} className={fitToViewport ? "menu-grid-viewport" : undefined}>
            <div
                ref={contentRef}
                className="menu-grid"
                style={
                    {
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                        ...(fitToViewport ? { transform: `scale(${scale})`, transformOrigin: "top center" } : {}),
                    } as CSSProperties
                }
            >
                {items.map((item, index) => (
                    <PotionCard key={`${item.category}-${item.name}-${index}`} item={item} index={index} />
                ))}
            </div>
        </div>
    );
}
