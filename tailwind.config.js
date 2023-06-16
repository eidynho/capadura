/** @type {import('tailwindcss').Config} */

import tailwindcss from "@headlessui/tailwindcss";

module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        fontFamily: {
            manrope: ["var(--font-manrope), sans-serif"],
            mono: ["var(--font-space-mono)", "ui-monospace", "SFMono-Regular"],
        },
        extends: {
            colors: {
                // light
                primary: "#F5F5F0",

                // dark
                "primary-dark": "#1E191E",

                primary: "#FA9BFA",
                secondary: "#73DC8F",
                tertiary: "#4B78E6",
            },
        },
    },
    plugins: [tailwindcss({ prefix: "ui" })],
};
