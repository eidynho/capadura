import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface SubtitleProps extends HTMLAttributes<HTMLHeadingElement> {
    className?: string;
    children: string;
}

export function Subtitle({ className, children }: SubtitleProps) {
    return <p className={twMerge("text-zinc-500", className)}>{children}</p>;
}
