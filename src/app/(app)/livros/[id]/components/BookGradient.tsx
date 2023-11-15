"use client";

import { createPortal } from "react-dom";

import { useColorPalette } from "@/hooks/useColorPalette";
import { cn } from "@/utils/cn";

interface BookGradientProps {
    bookImageUrl?: string;
    className?: string;
}

export function BookGradient({ bookImageUrl, className }: BookGradientProps) {
    const palette = useColorPalette(bookImageUrl);

    const gradientStyle = {
        background: `linear-gradient(45deg, ${palette.join(", ")})`,
    };

    const bookContainerRef = document.getElementById("book-page-container");

    return (
        bookContainerRef &&
        createPortal(
            <>
                <div
                    className={cn(
                        "absolute left-0 top-0 z-0 h-[32rem] w-full opacity-40 transition-all dark:opacity-50 md:h-[22rem]",
                        className,
                    )}
                    style={gradientStyle}
                ></div>
                <div className="absolute left-0 top-0 z-0 h-[32rem] w-full bg-gradient-to-t from-light transition-all dark:from-dark md:h-[22rem]"></div>
            </>,
            bookContainerRef,
        )
    );
}
