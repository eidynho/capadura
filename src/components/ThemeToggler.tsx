"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "./ui/Button";

export function ThemeToggler() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const storedTheme = localStorage.getItem("@contopia-theme-v1.0.0");
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
        localStorage.setItem("@contopia-theme-v1.0.0", newTheme);
        document.documentElement.classList.toggle("dark");
    }

    return (
        <Button size="md" variant="outline" onClick={toggleTheme} className="px-3">
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </Button>
    );
}
