"use client";

import { useRef, type CSSProperties } from "react";
import { useFitToViewport, useBalancedColumns } from "./utils/hooks";
import CharacterCard from "./CharacterCard";
import type { Item } from "../app/drinksData";

// Denser than MenuGrid's MIN_CARD_WIDTH_PX (176px) on purpose: the Drinks screen's 17 items
// need to read as one roster, not a scrolled/shrunk potion grid — see .character-card in
// globals.css, kept in sync with this width the same way MenuGrid keeps its constant in sync
// with .potion-card.
const MIN_CARD_WIDTH_PX = 128; // 8rem
const GRID_GAP_PX = 12; // 0.75rem

// Mirrors MenuGrid's structure/props (same useFitToViewport contract) so the template registry
// can swap one for the other without MenuScreen/ScreenCarousel needing to know which is active.
// Split into two "sides" purely for roster-select flavor — just the halfway mark, not a
// curated hero/villain call (nothing in the data model claims any drink is "good" or "evil"),
// hence the deliberately tongue-in-cheek labels rather than a real faction name.
export default function RosterGrid({ items, fitToViewport = false }: { items: Item[]; fitToViewport?: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const leftContainerRef = useRef<HTMLDivElement>(null);
    const rightContainerRef = useRef<HTMLDivElement>(null);

    const scale = useFitToViewport(containerRef, contentRef, fitToViewport);

    const splitAt = Math.ceil(items.length / 2);
    const leftItems = items.slice(0, splitAt);
    const rightItems = items.slice(splitAt);

    const leftColumns = useBalancedColumns(leftContainerRef, leftItems.length, MIN_CARD_WIDTH_PX, GRID_GAP_PX);
    const rightColumns = useBalancedColumns(rightContainerRef, rightItems.length, MIN_CARD_WIDTH_PX, GRID_GAP_PX);

    if (items.length === 0) {
        return null;
    }

    return (
        <div ref={containerRef} className={fitToViewport ? "roster-grid-viewport" : undefined}>
            <div
                ref={contentRef}
                className="roster-groups"
                style={
                    fitToViewport
                        ? ({ transform: `scale(${scale})`, transformOrigin: "top center" } as CSSProperties)
                        : undefined
                }
            >
                <div ref={leftContainerRef} className="roster-group">
                    <h3 className="roster-group-label">This Side</h3>
                    <div
                        className="roster-grid"
                        style={{ gridTemplateColumns: `repeat(${leftColumns}, minmax(0, 1fr))` } as CSSProperties}
                    >
                        {leftItems.map((item, index) => (
                            <CharacterCard key={`${item.category}-${item.name}-${index}`} item={item} index={index} />
                        ))}
                    </div>
                </div>
                <div className="roster-divider" aria-hidden="true" />
                <div ref={rightContainerRef} className="roster-group">
                    <h3 className="roster-group-label">That Side</h3>
                    <div
                        className="roster-grid"
                        style={{ gridTemplateColumns: `repeat(${rightColumns}, minmax(0, 1fr))` } as CSSProperties}
                    >
                        {rightItems.map((item, index) => (
                            <CharacterCard
                                key={`${item.category}-${item.name}-${index}`}
                                item={item}
                                index={splitAt + index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
