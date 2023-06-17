interface SeparatorProps {
    className?: string;
}

export function Separator({ className }: SeparatorProps) {
    return <hr className={`${className ? className : "border-black"} dark:border-primary my-4`} />;
}
