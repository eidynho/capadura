"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "./ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

type ThemeOptions = "light" | "dark";

export function ThemeToggler() {
    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem("@contopia-theme-v1.0.0");

        return storedTheme || "light";
    });

    useEffect(() => {
        const storedTheme = localStorage.getItem("@contopia-theme-v1.0.0");

        if (storedTheme) {
            setTheme(storedTheme);

            if (storedTheme === "dark") {
                document.documentElement.classList.toggle("dark");
            }
        } else {
            const userPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const newTheme = userPrefersDark ? "dark" : "light";

            setTheme(newTheme);

            if (newTheme === "dark") {
                document.documentElement.classList.toggle("dark");
            }
        }
    }, []);

    function toggleTheme(newTheme: ThemeOptions) {
        const isSameTheme = theme === newTheme;

        setTheme(newTheme);
        localStorage.setItem("@contopia-theme-v1.0.0", newTheme);

        if (!isSameTheme) {
            document.documentElement.classList.toggle("dark");
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="md" variant="outline" className="px-3">
                    {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toggleTheme("light")}>Claro</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleTheme("dark")}>Escuro</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
