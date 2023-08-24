import { ReactNode } from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/utils/cn";

interface LinkUnderlineProps {
    asChild?: boolean;
    children: ReactNode;
    href?: string;
    target?: string;
    className?: string;
}

export function LinkUnderline({
    asChild,
    children,
    href = "",
    target = "_self",
    className,
}: LinkUnderlineProps) {
    const Component = asChild ? Slot : Link;

    return (
        <div className={cn("group relative inline-block", className)}>
            <Component href={href} target={target}>
                {children}
            </Component>
            <div className="absolute bottom-0 left-0 right-auto top-auto h-[1px] w-0 bg-black transition-all duration-200 will-change-auto group-hover:w-full"></div>
        </div>
    );
}
