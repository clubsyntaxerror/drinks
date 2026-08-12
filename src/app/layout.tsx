import "./globals.css";
import { Press_Start_2P, VT323 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

// Placeholder pixel fonts until a bespoke dungeon-style font is produced (spec.md §12).
// Self-hosted by next/font at build time — no runtime request, no layout shift.
const display = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = VT323({ weight: "400", subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata = {
    title: "Syntax Error — Drinks Menu",
    description: "Elixirs, drinks, and the basics — Club Syntax Error's digital bar menu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${display.variable} ${body.variable} font-body`}>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
