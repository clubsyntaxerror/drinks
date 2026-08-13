"use client";

import { useRef, type CSSProperties } from "react";
import { useBalancedColumns } from "./utils/hooks";
import CharacterCard from "./CharacterCard";
import type { Item } from "../app/drinksData";

// Deliberately lands 9 items at 3 columns/3 rows (not more columns) — .character-card stacks
// portrait above text (see CharacterCard.tsx/globals.css), so packing it into many narrow
// columns would make it too cramped. Measured against a *single* side's width
// (useBalancedColumns runs on leftContainerRef,
// ~half the screen once split into "This Side"/"That Side" below). Kept in sync with
// .character-card in globals.css the same way MenuGrid keeps its constant in sync with
// .potion-card.
const MIN_CARD_WIDTH_PX = 230; // ~14.4rem
const GRID_GAP_PX = 20; // 1.25rem

// Mirrors MenuGrid's structure/props (same useFitToViewport contract) so the template registry
// can swap one for the other without MenuScreen/ScreenCarousel needing to know which is active.
// Split into two "sides" purely for roster-select flavor — just the halfway mark, not a
// curated hero/villain call (nothing in the data model claims any drink is "good" or "evil"),
// hence the deliberately tongue-in-cheek labels rather than a real faction name. The labels sit
// in corner "plaques" pinned to the screen itself (see .roster-side-plaque), not the grid — so
// they read as a screen-level frame element in the header row, and so they don't eat into the
// grid's own share of the available height.
export default function RosterGrid({ items, fitToViewport = false }: { items: Item[]; fitToViewport?: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const leftContainerRef = useRef<HTMLDivElement>(null);

    const splitAt = Math.ceil(items.length / 2);
    const leftItems = items.slice(0, splitAt);
    const rightItems = items.slice(splitAt);

    // Measured off the left group only and reused for both — the two groups are equal-width
    // flex siblings, but measuring each independently could land on different column counts
    // between them (e.g. one group's ResizeObserver settling a beat before the other's) and
    // read as visually inconsistent. Using the larger item count keeps the wider side's cards
    // from being forced narrower than the narrower side's.
    const columns = useBalancedColumns(
        leftContainerRef,
        Math.max(leftItems.length, rightItems.length),
        MIN_CARD_WIDTH_PX,
        GRID_GAP_PX,
    );

    if (items.length === 0) {
        return null;
    }

    return (
        <>
            <div className="roster-side-plaque roster-side-plaque-left">This Side</div>
            <div className="roster-side-plaque roster-side-plaque-right">That Side</div>
            <div ref={containerRef} className={fitToViewport ? "roster-grid-viewport" : undefined}>
                <div ref={contentRef} className="roster-groups">
                    <div ref={leftContainerRef} className="roster-group">
                        <div
                            className="roster-grid"
                            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } as CSSProperties}
                        >
                            {leftItems.map((item, index) => (
                                <CharacterCard
                                    key={`${item.category}-${item.name}-${index}`}
                                    item={item}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="roster-divider" aria-hidden="true" />
                    <div className="roster-group">
                        <div
                            className="roster-grid"
                            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } as CSSProperties}
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
        </>
    );
}
