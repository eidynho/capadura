import { ReactNode } from "react";

interface BookLayoutProps {
    children: ReactNode;
}

export default async function BookLayout({ children }: BookLayoutProps) {
    return <>{children}</>;
}
