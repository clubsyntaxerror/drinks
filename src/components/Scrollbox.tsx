"use client";

import { useEffect, useState } from "react";
import Textra from "react-textra";
import { useMediaQuery } from "./utils/hooks";
import { isWithinDailyWindow } from "./utils/time";
import type { Message } from "../app/drinksData";

function StaticMessages({ messages }: { messages: string[] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (messages.length < 2) {
            return;
        }
        const interval = setInterval(() => setIndex((i) => (i + 1) % messages.length), 6000);
        return () => clearInterval(interval);
    }, [messages]);

    return <span>{messages[index]}</span>;
}

// Re-checks messages against the current time once a minute so a scheduled one (e.g. a happy
// hour banner with a toTime) drops off the live kiosk display on its own — without that, it'd
// only disappear on the next page load or server revalidation, up to minutes late.
function useActiveMessages(messages: Message[]): string[] {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(interval);
    }, []);

    return messages
        .filter((message) => isWithinDailyWindow(message.fromTime, message.toTime, now))
        .map((message) => message.text);
}

export default function Scrollbox({ messages }: { messages: Message[] }) {
    const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
    const activeMessages = useActiveMessages(messages);
    // Both StaticMessages' local index state and (worse) Textra's internal textArrIndex ref
    // are never reset or clamped when `data` shrinks (e.g. a message's toTime passes and it
    // drops out) — Textra's ref just keeps incrementing past the new, shorter array forever,
    // rendering blank until something remounts it (previously only a full page reload). Keying
    // on the active set itself forces that remount ourselves the moment the set changes.
    const activeKey = activeMessages.join("|");

    return (
        <div className="scrollbox">
            {activeMessages.length > 0 &&
                (prefersReducedMotion !== false ? (
                    <StaticMessages key={activeKey} messages={activeMessages} />
                ) : (
                    <Textra key={activeKey} effect="simple" data={activeMessages} />
                ))}
        </div>
    );
}
