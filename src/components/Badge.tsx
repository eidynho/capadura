"use client";

import { useState, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
    children: ReactNode;
    variant?: "green" | "sky" | "yellow" | "red" | "gray";
    className?: string;
}

export function Badge({ children, variant, className, ...props }: BadgeProps) {
    const [variantStyles] = useState(() => {
        switch (variant) {
            case "green":
                return "border-green-500 bg-green-500/10";
            case "sky":
                return "border-sky-500 bg-sky-500/10";
            case "yellow":
                return "border-yellow-500 bg-yellow-500/10";
            case "red":
                return "border-red-500 bg-red-500/10";
            default:
                return "border-gray-500 bg-gray-500/10";
        }
    });

    return (
        <div
            className={twMerge(
                "flex select-none items-center gap-1 rounded-lg border px-2 py-1 text-xs",
                variantStyles,
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}
