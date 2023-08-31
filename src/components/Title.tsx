import { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
    className?: string;
    children: string;
}

export function Title({ className, children }: TitleProps) {
    return (
        <h1
            className={cn(
                "text-2xl font-bold leading-relaxed tracking-tight text-black dark:text-white",
                className,
            )}
        >
            {children}
        </h1>
    );
}
