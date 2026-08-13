import "./globals.css";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";

// Bespoke fonts (public/fonts/): bitpotion is the site-wide default (potion names,
// ingredients, spirit, index, headers, everything), lamano is reserved for screen headlines
// (ELIXIRS, DRINKS, ...) only. Both are self-hosted local files, not Google Fonts, so
// next/font/local rather than next/font/google.
const bitpotion = localFont({
    src: "../../public/fonts/bitpotion.woff2",
    variable: "--font-bitpotion",
    display: "swap",
});
const lamano = localFont({ src: "../../public/fonts/lamano.woff2", variable: "--font-lamano", display: "swap" });

export const metadata = {
    title: "Syntax Error — Drinks Menu",
    description: "Elixirs, drinks, and the basics — Club Syntax Error's digital bar menu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${bitpotion.variable} ${lamano.variable} font-bitpotion`}>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
