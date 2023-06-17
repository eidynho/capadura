import { ReactNode } from "react";

interface ContinerProps {
    children: ReactNode;
}

export function Container({ children }: ContinerProps) {
    return (
        <div className="flex w-full items-center justify-center">
            <div className="mb-14 mt-6 w-[95%] max-w-7xl lg:w-4/5">{children}</div>
        </div>
    );
}
