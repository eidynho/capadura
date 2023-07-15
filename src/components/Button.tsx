import { useState, useEffect, ReactNode, ButtonHTMLAttributes, ElementType } from "react";
import { Slot } from "@radix-ui/react-slot";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    asChild?: boolean;
    size?: string;
    className?: string;
}

export function Button({ children, asChild, size, className, ...props }: ButtonProps) {
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

    const Component = asChild ? Slot : "button";

    return (
        <Component
            className={twMerge(
                `flex items-center justify-center gap-2 rounded-lg border border-black bg-black  text-white transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:bg-yellow-500 hover:text-black hover:shadow-[0.25rem_0.25rem_#000] disabled:cursor-default disabled:border-black disabled:bg-black/80 disabled:bg-opacity-100 disabled:text-white`,
                sizeStyles,
                className,
            )}
            {...props}
        >
            {children}
        </Component>
    );
}
