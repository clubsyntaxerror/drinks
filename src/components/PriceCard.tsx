"use client";

import { useEffect, useState } from "react";
import { isWithinDailyWindow, msUntilDailyTime, formatCountdown } from "./utils/time";
import type { CategoryPricing, PriceListEntry } from "../app/drinksData";

// undefined until mounted, then ticks every second. Left undefined for both the server render
// and the client's first (pre-effect) hydration pass, rather than seeded from `new Date()` —
// this component renders live, second-granularity text (the happy-hour countdown), and the real
// clock would almost always differ by the time the client hydrates versus when the server
// rendered, causing a hydration mismatch. Deferring the first real Date to the effect (a
// client-only update, never compared against SSR markup) sidesteps that instead of racing it.
function useNow(): Date | undefined {
    const [now, setNow] = useState<Date>();

    useEffect(() => {
        setNow(new Date());
        const interval = setInterval(() => setNow(new Date()), 1_000);
        return () => clearInterval(interval);
    }, []);

    return now;
}

function PriceRow({ label, price, happyHourPrice, happyHourUntil, now }: PriceListEntry & { now: Date | undefined }) {
    const isHappyHour =
        now !== undefined && happyHourPrice !== undefined && isWithinDailyWindow(undefined, happyHourUntil, now);

    return (
        <div className="price-list-row">
            <span className="price-list-label">{label}</span>
            <span className="price-list-value">
                {isHappyHour ? (
                    <>
                        <span className="price-list-happy">{happyHourPrice}:-</span>{" "}
                        <span className="price-list-strike">{price}:-</span>
                    </>
                ) : (
                    <>{price}:-</>
                )}
            </span>
        </div>
    );
}

// The elixirs template's leading grid card (see MenuGrid.tsx) — a plain two-column price list
// instead of a potion, reusing .potion-card's frame/background so it reads as part of the same
// grid rather than a bolted-on sidebar. Spans both of the grid's rows via CSS (.price-card),
// same as any dungeon-crawler "shop price list" signpost would sit apart from the item slots.
export default function PriceCard({
    categoryPricing,
    priceList,
}: {
    categoryPricing?: CategoryPricing;
    priceList: PriceListEntry[];
}) {
    const now = useNow();
    const hasElixirPricing = categoryPricing?.price !== undefined || categoryPricing?.nonAlcoholicPrice !== undefined;

    if (!hasElixirPricing && priceList.length === 0) {
        return null;
    }

    // "Ends in" targets the *soonest* active cutoff, not just the first row's — rows could in
    // principle carry different happyHourUntil values even though every sample row currently
    // shares "23:00". Framed as a status effect (see .price-card-status) rather than plain
    // copy, matching the RPG-menu voice the rest of the card/site is written in. Empty (so the
    // footer stays hidden) until mounted, same reasoning as useNow above.
    const activeHappyHourUntils =
        now === undefined
            ? []
            : priceList
                  .filter(
                      (entry) =>
                          entry.happyHourPrice !== undefined &&
                          isWithinDailyWindow(undefined, entry.happyHourUntil, now),
                  )
                  .map((entry) => entry.happyHourUntil)
                  .filter((until): until is string => until !== undefined);
    const happyHourRemainingMs =
        now !== undefined && activeHappyHourUntils.length > 0
            ? Math.min(...activeHappyHourUntils.map((until) => msUntilDailyTime(until, now) ?? Infinity))
            : undefined;

    return (
        <article className="potion-card price-card">
            <span aria-hidden="true" className="potion-card-frame-shine" />
            <div className="price-card-body">
                {categoryPricing?.price !== undefined && (
                    <div className="price-list-row price-list-row-category">
                        <span className="price-list-label">Elixirs</span>
                        <span className="price-list-value">{categoryPricing.price}:-</span>
                    </div>
                )}
                {categoryPricing?.nonAlcoholicPrice !== undefined && (
                    <div className="price-list-row price-list-row-category">
                        <span className="price-list-label">Non-alcoholic</span>
                        <span className="price-list-value">{categoryPricing.nonAlcoholicPrice}:-</span>
                    </div>
                )}
                {hasElixirPricing && priceList.length > 0 && <div className="price-list-spacer" aria-hidden="true" />}
                {priceList.map((entry) => (
                    <PriceRow key={entry.label} {...entry} now={now} />
                ))}
            </div>
            {happyHourRemainingMs !== undefined && Number.isFinite(happyHourRemainingMs) && (
                <p className="price-card-status">
                    <span className="price-card-status-label">Happy Hour Active</span>
                    <span className="price-card-status-timer">Ends in {formatCountdown(happyHourRemainingMs)}</span>
                </p>
            )}
        </article>
    );
}
