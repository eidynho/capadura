"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "phosphor-react";

export function ThemeToggler() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const storedTheme = localStorage.getItem("@viniciuseidy-portfolio-theme-v1.0.0");
        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            const userPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(userPrefersDark ? "dark" : "light");
        }
    }, []);

    function toggleTheme() {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("@viniciuseidy-portfolio-theme-v1.0.0", newTheme);
        document.documentElement.classList.toggle("dark");
    }

    return (
        <button
            onClick={toggleTheme}
            className="rounded-md p-1 text-black
            dark:text-white"
        >
            {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
        </button>
    );
}
