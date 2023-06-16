import { HTMLAttributes } from "react";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children: string;
}

export function Title({ children }: TitleProps) {
    return <h1 className="text-3xl mb-4">{children}</h1>;
}
