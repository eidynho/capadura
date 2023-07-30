import { ReactNode } from "react";

interface ConfigLayoutProps {
    children: ReactNode;
}
export default function ConfigLayout({ children }: ConfigLayoutProps) {
    return <div>{children}</div>;
}
