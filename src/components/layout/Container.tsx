import { ReactNode } from "react";

interface ContinerProps {
    children: ReactNode;
}

export function Container({ children }: ContinerProps) {
    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-[95%] mt-20 mb-14 lg:w-4/5">{children}</div>
        </div>
    );
}
