/** @type {import('tailwindcss').Config} */

import tailwindcss from "@headlessui/tailwindcss";

module.exports = {
    mode: "jit",
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        fontFamily: {
            manrope: ["var(--font-manrope), sans-serif"],
            mono: ["var(--font-space-mono)", "ui-monospace", "SFMono-Regular"],
        },
        extend: {
            colors: {
                // light
                primary: "#F5F5F0",

                // dark
                "primary-dark": "#1E191E",
            },
        },
    },
    plugins: [tailwindcss({ prefix: "ui" })],
};
