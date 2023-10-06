import { ReactNode } from "react";

interface BookLayoutProps {
    children: ReactNode;
}

export default async function BookReadLayout({ children }: BookLayoutProps) {
    return <>{children}</>;
}
