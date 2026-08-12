"use client";

import { useEffect, useState } from "react";
import Textra from "react-textra";
import { useMediaQuery } from "./utils/hooks";

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

export default function Scrollbox({ messages }: { messages: string[] }) {
    const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

    return (
        <div className="scrollbox">
            {messages.length > 0 &&
                (prefersReducedMotion !== false ? (
                    <StaticMessages messages={messages} />
                ) : (
                    <Textra effect="simple" data={messages} />
                ))}
        </div>
    );
}
