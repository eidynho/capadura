import { ReactNode } from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { twMerge } from "tailwind-merge";

interface LinkUnderlineProps {
    asChild?: boolean;
    children: ReactNode;
    href: string;
    className?: string;
}

export function LinkUnderline({ asChild, children, href, className }: LinkUnderlineProps) {
    const Component = asChild ? Slot : Link;

    return (
        <div className="group relative">
            <Component href={href} className={twMerge("flex items-center gap-1", className)}>
                {children}
            </Component>
            <div className="absolute bottom-0 left-0 right-auto top-auto h-[1px] w-0 bg-black transition-all duration-200 will-change-auto group-hover:w-full"></div>
        </div>
    );
}
