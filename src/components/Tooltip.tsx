import { ReactNode } from "react";

interface TooltipProps {
    children: ReactNode;
    message: string;
}

export function Tooltip({ children, message }: TooltipProps) {
    return (
        <div
            className="relative text-xs before:z-10 before:absolute before:-right-3 before:top-1/2 before:w-max before:max-w-[16rem] before:translate-x-full before:-translate-y-1/2 before:rounded-md before:bg-black before:px-3 before:py-2 before:text-white before:invisible before:content-[attr(data-tip)] after:z-10 after:absolute after:-right-[0.8rem] after:top-1/2 after:h-0 after:w-0 after:translate-x-0 after:-translate-y-1/2 after:border-8 after:border-r-black after:border-l-transparent after:border-b-transparent after:border-t-transparent after:invisible hover:before:visible hover:after:visible"
            data-tip={message}
        >
            {children}
        </div>
    );
}
