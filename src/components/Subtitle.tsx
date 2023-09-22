import { HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

interface SubtitleProps extends HTMLAttributes<HTMLHeadingElement> {
    className?: string;
    children: string;
}

export function Subtitle({ className, children }: SubtitleProps) {
    return <p className={cn("text-muted-foreground", className)}>{children}</p>;
}
