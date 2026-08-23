"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMediaQuery } from "./utils/hooks";
import MenuScreen from "./MenuScreen";
import Scrollbox from "./Scrollbox";
import Background from "./Background";
import { getTemplate } from "./templates";
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

    const template = getTemplate(active.template);

    return (
        // .tv-viewport is the real, whatever-shape browser viewport; .tv-stage is a fixed 16:9
        // "screen" sized off .tv-viewport's height alone (see globals.css), so this always
        // demos as a real TV/kiosk would even when opened on a phone/laptop, without needing
        // device emulation — on anything narrower than 16:9 relative to its height, .tv-viewport
        // scrolls horizontally to reveal the rest instead of squeezing .tv-stage's layout.
        // Background is `scoped` (absolute, not fixed) so it tracks .tv-stage's own box through
        // that scrolling instead of staying pinned to .tv-viewport's full (possibly wider/
        // narrower) bounds.
        <div className="tv-viewport">
            {/* Scrollbox sits outside the keyed/remounted subtree below on purpose — it holds
                its own message-cycling timer, and a guest reading a message mid-cycle shouldn't
                see it jump back to message 1 just because the screen behind it changed. Only the
                screen's own content (and its background, which *should* change per screen)
                remounts. */}
            <div className="tv-stage">
                <Background
                    key={`bg-${active.key}`}
                    image={template.backgroundImage}
                    theme={template.backgroundTheme}
                    scoped
                />
                <div
                    className={`tv-stage-screen${prefersReducedMotion ? "" : " tv-stage-animated"}`}
                    key={`screen-${active.key}`}
                >
                    <MenuScreen screen={active} items={activeItems} fitToViewport />
                </div>
                <Scrollbox messages={messages} />
            </div>
        </div>
    );
}
