import { ReactNode } from "react";

interface BookLayoutProps {
    children: ReactNode;
}
export default function BookLayout({ children }: BookLayoutProps) {
    return <div>{children}</div>;
}
