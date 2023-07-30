import { ReactNode } from "react";

interface MeLayoutProps {
    children: ReactNode;
}
export default function MeLayout({ children }: MeLayoutProps) {
    return <div>{children}</div>;
}
