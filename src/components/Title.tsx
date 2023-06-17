import { HTMLAttributes } from "react";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
    className?: string;
    children: string;
}

export function Title({ className, children }: TitleProps) {
    return <h1 className={`${className ? className : ""} text-3xl`}>{children}</h1>;
}
