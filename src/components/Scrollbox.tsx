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

    return (
        <div className="scrollbox">
            {activeMessages.length > 0 &&
                (prefersReducedMotion !== false ? (
                    <StaticMessages messages={activeMessages} />
                ) : (
                    <Textra effect="simple" data={activeMessages} />
                ))}
        </div>
    );
}
