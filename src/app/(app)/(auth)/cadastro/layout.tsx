import { ReactNode } from "react";

interface SignUpLayoutProps {
    children: ReactNode;
}
export default function SignUpLayout({ children }: SignUpLayoutProps) {
    return <div>{children}</div>;
}
