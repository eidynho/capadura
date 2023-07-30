import { HTMLAttributes } from "react";

interface SubtitleProps extends HTMLAttributes<HTMLHeadingElement> {
    className?: string;
    children: string;
}

export function Subtitle({ className, children }: SubtitleProps) {
    return (
        <h2 className={`${className ? className : ""} text-sm font-medium uppercase`}>
            {children}
        </h2>
    );
}
