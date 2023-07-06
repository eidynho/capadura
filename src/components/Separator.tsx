import { twMerge } from "tailwind-merge";

interface SeparatorProps {
    className?: string;
}

export function Separator({ className }: SeparatorProps) {
    return <hr className={twMerge("my-4 border-black dark:border-primary", className)} />;
}
