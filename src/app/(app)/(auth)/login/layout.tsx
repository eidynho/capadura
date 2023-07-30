import { ReactNode } from "react";

interface LoginLayoutProps {
    children: ReactNode;
}
export default function LoginLayout({ children }: LoginLayoutProps) {
    return <div>{children}</div>;
}
