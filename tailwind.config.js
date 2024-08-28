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
            width: {
                "600px": "600px", // Add a custom width of 600px
            },
        },
    },
    plugins: [],
};
