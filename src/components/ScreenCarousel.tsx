"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMediaQuery } from "./utils/hooks";
import MenuScreen from "./MenuScreen";
import Scrollbox from "./Scrollbox";
import type { Item, Message, Screen } from "../app/drinksData";

// TV-only: cycles through `screens` on a per-screen timer read from the sheet. Debug params:
// ?screen=<index> jumps straight to a screen, ?paused=1 stops the timer — both for on-site
// setup/testing without a redeploy (see spec.md §4).
export default function ScreenCarousel({
    screens,
    items,
    messages,
}: {
    screens: Screen[];
    items: Item[];
    messages: Message[];
}) {
    const searchParams = useSearchParams();
    const paused = searchParams.get("paused") === "1";
    const screenParam = searchParams.get("screen");

    const [index, setIndex] = useState(() => {
        const parsed = screenParam ? Number(screenParam) : NaN;
        return Number.isInteger(parsed) && parsed >= 0 && parsed < screens.length ? parsed : 0;
    });

    const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
    const active = screens[index];

    useEffect(() => {
        if (paused || screens.length < 2) {
            return;
        }
        const durationMs = (active?.durationSeconds || 14) * 1000;
        const timer = setTimeout(() => setIndex((i) => (i + 1) % screens.length), durationMs);
        return () => clearTimeout(timer);
    }, [index, paused, screens.length, active?.durationSeconds]);

    const activeItems = useMemo(
        () => items.filter((item) => item.category.toLowerCase() === active?.key.toLowerCase()),
        [items, active?.key],
    );

    if (!active) {
        return null;
    }

    return (
        <div className={`tv-stage${prefersReducedMotion ? "" : " tv-stage-animated"}`} key={active.key}>
            <MenuScreen screen={active} items={activeItems} fitToViewport />
            <Scrollbox messages={messages.map((message) => message.text)} />
        </div>
    );
}
