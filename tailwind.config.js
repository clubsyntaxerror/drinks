/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            fontFamily: {
                display: ["var(--font-display)"],
                body: ["var(--font-body)"],
                bitpotion: ["var(--font-bitpotion)"],
                lamano: ["var(--font-lamano)"],
            },
        },
    },
    plugins: [],
};
