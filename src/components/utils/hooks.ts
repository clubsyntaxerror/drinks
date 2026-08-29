"use client";

import { useEffect, useState, type RefObject } from "react";

export function useMediaQuery(query: string) {
    const [matches, setMatches] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        const mql = window.matchMedia(query);
        setMatches(mql.matches);
        const listener = () => setMatches(mql.matches);
        mql.addEventListener("change", listener);
        return () => mql.removeEventListener("change", listener);
    }, [query]);

    return matches;
}

// Scales `contentRef` down (never up) so it fits inside `containerRef` without overflowing,
// by comparing natural content size against available space. Used to keep the TV route from
// ever needing to scroll regardless of how many sheet rows exist.
export function useFitToViewport(
    containerRef: RefObject<HTMLElement | null>,
    contentRef: RefObject<HTMLElement | null>,
    enabled: boolean,
    minScale = 0.4,
) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (!enabled) {
            setScale(1);
            return;
        }

        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) {
            return;
        }

        const recalc = () => {
            const availableHeight = container.clientHeight;
            const availableWidth = container.clientWidth;
            const contentHeight = content.scrollHeight;
            const contentWidth = content.scrollWidth;

            if (!availableHeight || !availableWidth || !contentHeight || !contentWidth) {
                return;
            }

            const nextScale = Math.min(1, availableHeight / contentHeight, availableWidth / contentWidth);
            setScale(Math.max(minScale, nextScale));
        };

        recalc();
        const resizeObserver = new ResizeObserver(recalc);
        resizeObserver.observe(container);
        resizeObserver.observe(content);
        return () => resizeObserver.disconnect();
    }, [enabled, containerRef, contentRef, minScale]);

    return scale;
}

// Picks a column count that fills whole rows evenly (e.g. 10 items -> 5x2, not "as many as fit
// on row 1, leftovers on row 2"), by first finding how many minColumnWidth-wide columns fit in
// the container, then working out the row count that needs, then dividing items evenly across
// that many rows. Matches the reference image's rectangular grid instead of CSS auto-fit's
// greedy packing. Uncapped by default (minRows: 1): a bigger roster (e.g. Drinks) is meant to
// spread wider and use more of the screen as items are added, not shrink into more rows at the
// same column count. minRows opts a caller out of that for item counts small enough to fit in
// fewer rows than intended — Elixirs' 8 items comfortably fit in a single row on a TV-width
// container, but the screen is designed around a 2-row grid regardless of exact count, so it
// passes minRows: 2 to keep that shape (8 -> 4x2, same as 10 -> 5x2 before two were removed).
export function useBalancedColumns(
    containerRef: RefObject<HTMLElement | null>,
    itemCount: number,
    minColumnWidth: number,
    gap: number,
    minRows: number = 1,
    // Subtracted from the measured container width before fitting columns — lets a caller
    // reserve room for something else sharing the same row-balancing container (MenuGrid's
    // PriceCard, which takes its own column outside this count) without it being squeezed out
    // of the width this hook thinks it has to work with.
    reservedWidthPx: number = 0,
) {
    const [columns, setColumns] = useState(() => Math.max(1, Math.min(itemCount, 4)));

    useEffect(() => {
        const container = containerRef.current;
        if (!container || itemCount === 0) {
            return;
        }

        const recalc = () => {
            const width = container.clientWidth - reservedWidthPx;
            if (!width) {
                return;
            }

            const maxColumnsThatFit = Math.max(1, Math.floor((width + gap) / (minColumnWidth + gap)));
            const maxColumnsForMinRows = Math.ceil(itemCount / minRows);
            const columnsToFill = Math.min(maxColumnsThatFit, itemCount, maxColumnsForMinRows);
            const rows = Math.ceil(itemCount / columnsToFill);
            setColumns(Math.ceil(itemCount / rows));
        };

        recalc();
        const resizeObserver = new ResizeObserver(recalc);
        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, [containerRef, itemCount, minColumnWidth, gap, minRows, reservedWidthPx]);

    return columns;
}
