import { cn } from "@/utils/cn";
import { ReactNode } from "react";

interface ContinerProps {
    children: ReactNode;
    className?: string;
}

export function Container({ children, className }: ContinerProps) {
    return (
        <div className={cn("flex w-full items-center justify-center", className)}>
            <div className="mb-14 mt-20 w-[calc(100%-32px)] max-w-7xl md:w-[calc(100%-48px)] xl:w-4/5">
                {children}
            </div>
        </div>
    );
}
