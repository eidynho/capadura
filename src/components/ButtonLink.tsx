import Link from "next/link";
import { useState, useEffect, ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    href: string;
    size?: string;
    className?: string;
}

export function ButtonLink({ children, href, size, className }: ButtonProps) {
    const [sizeStyles, setSizeStyles] = useState(() => {
        switch (size) {
            case "xs":
                return "text-xs px-3 py-1";
            case "sm":
                return "text-sm px-3 py-2";
            case "md":
                return "text-base px-4 py-3";
            case "lg":
                return "text-2xl px-8 py-4";
            default:
                return "text-sm px-2 py-2";
        }
    });

    useEffect(() => {
        switch (size) {
            case "xs":
                setSizeStyles("text-xs px-3 py-1");
                break;
            case "sm":
                setSizeStyles("text-sm px-3 py-2");
                break;
            case "md":
                setSizeStyles("text-base px-4 py-3");
                break;
            case "lg":
                setSizeStyles("text-2xl px-8 py-4");
                break;
        }
    }, [size]);

    return (
        <Link
            href={href}
            className={`font-manrope ${sizeStyles} ${
                className ? className : "bg-black enabled:hover:bg-yellow-500"
            }   
                flex gap-2 items-center justify-center rounded-lg text-white border border-black transition-all
                hover:text-white hover:shadow-[0.25rem_0.25rem_#000] hover:-translate-x-1 hover:-translate-y-1
                dark:border-white dark:text-white
                dark:hover:bg-white dark:hover:text-black
                disabled:text-black disabled:border-gray-200 disabled:bg-gray-200 disabled:bg-opacity-100 disabled:cursor-not-allowed
            `}
        >
            {children}
        </Link>
    );
}
