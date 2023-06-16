import { useState, useEffect, ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    size?: string;
    className?: string;
}

export const activeEffectStyles =
    "shadow-[0.25rem_0.25rem_#000] -translate-x-1 -translate-y-1 opacity-100";
export const hoverEffectStyles =
    "enabled:hover:text-black enabled:hover:shadow-[0.25rem_0.25rem_#000] enabled:hover:-translate-x-1 enabled:hover:-translate-y-1";

export function Button({ children, size, className, ...props }: ButtonProps) {
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
        <button
            className={`font-manrope ${sizeStyles} ${
                className ? className : "bg-black text-white enabled:hover:bg-yellow-500"
            }   
                flex gap-2 items-center justify-center rounded-lg  border border-black transition-all ${hoverEffectStyles} disabled:text-black disabled:border-gray-200 disabled:bg-gray-200 disabled:bg-opacity-100 disabled:cursor-not-allowed
            `}
            {...props}
        >
            {children}
        </button>
    );
}
