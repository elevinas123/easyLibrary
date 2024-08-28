// tailwind.config.js
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // Include TypeScript and JSX/TSX files
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                serif: ["Source Serif Pro", "serif"],
                mono: ["Roboto Mono", "monospace"],
            },
        },
    },
    plugins: [],
};
