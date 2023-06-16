import { ReactNode } from "react";

interface MainContinerProps {
    children: ReactNode;
}

export function MainContainer({ children }: MainContinerProps) {
    return <main className="w-full bg-[#F4F4F0] lg:w-full ml-auto">{children}</main>;
}
