import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
    className?: string;
    children: string;
}

export function Title({ className, children }: TitleProps) {
    return (
        <h1 className={twMerge("text-2xl font-bold leading-relaxed tracking-tight", className)}>
            {children}
        </h1>
    );
}
