"use client";

import { useRef, type CSSProperties } from "react";
import { useFitToViewport, useBalancedColumns } from "./utils/hooks";
import PotionCard from "./PotionCard";
import type { Item } from "../app/drinksData";

// Cards are sized around .potion-card in globals.css — kept in sync here so the column-
// balancing math (useBalancedColumns) agrees with how a row actually lays out.
const MIN_CARD_WIDTH_PX = 176; // 11rem
const GRID_GAP_PX = 16; // 1rem
// Elixirs is designed around a 2-row grid regardless of exact item count (e.g. 8 -> 4x2), not
// however many columns happen to fit at MIN_CARD_WIDTH_PX — see useBalancedColumns' minRows.
const MIN_ROWS = 2;

// `fitToViewport` is only turned on by the TV route: it scales the grid down (never up) so
// it always fits the screen without scrolling, whatever the item count, using useBalancedColumns
// to pick a column count that fills whole rows evenly against the TV stage's own width. The
// mobile route leaves it off and just lets the grid wrap/scroll normally — its column count
// instead comes from plain CSS breakpoints on .menu-grid (globals.css), which suit a scrolling
// page much better than the TV route's row-balancing math: there's no fixed viewport to fit
// exactly, just "how many columns look right at this width," and a JS-computed column count
// was landing on visually inconsistent results across nearby phone widths.
export default function MenuGrid({ items, fitToViewport = false }: { items: Item[]; fitToViewport?: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const scale = useFitToViewport(containerRef, contentRef, fitToViewport);
    const columns = useBalancedColumns(containerRef, items.length, MIN_CARD_WIDTH_PX, GRID_GAP_PX, MIN_ROWS);

    if (items.length === 0) {
        return null;
    }

    return (
        <div ref={containerRef} className={fitToViewport ? "menu-grid-viewport" : undefined}>
            <div
                ref={contentRef}
                className="menu-grid"
                style={
                    fitToViewport
                        ? ({
                              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                              transform: `scale(${scale})`,
                              transformOrigin: "top center",
                          } as CSSProperties)
                        : undefined
                }
            >
                {items.map((item, index) => (
                    <PotionCard key={`${item.category}-${item.name}-${index}`} item={item} index={index} />
                ))}
            </div>
        </div>
    );
}
