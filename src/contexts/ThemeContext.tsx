"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type ThemeVariants = "light" | "dark";

interface ThemeContextType {
    theme: ThemeVariants;
    toggleTheme: (newTheme: ThemeVariants) => void;
}

interface ThemeProviderProps {
    children: ReactNode;
}

const ThemeContext = createContext({} as ThemeContextType);

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<ThemeVariants>("dark");

    useEffect(() => {
        const storedTheme = localStorage.getItem("@capadura-theme-v1.0.0");

        if (storedTheme === "light" || storedTheme === "dark") {
            setTheme(storedTheme);

            if (storedTheme === "dark") {
                document.documentElement.classList.add("dark");
            }
        } else {
            const userPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const newTheme = userPrefersDark ? "dark" : "light";

            setTheme(newTheme);

            if (newTheme === "dark") {
                document.documentElement.classList.add("dark");
            }
        }
    }, []);

    function toggleTheme(newTheme: ThemeVariants) {
        const isSameTheme = theme === newTheme;

        setTheme(newTheme);
        localStorage.setItem("@capadura-theme-v1.0.0", newTheme);

        if (!isSameTheme) {
            document.documentElement.classList.toggle("dark");
        }
    }

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeContext must be used within a ThemeContext.Provider");
    }

    return context;
}
