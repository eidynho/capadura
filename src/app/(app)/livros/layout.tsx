import { ReactNode } from "react";

interface BooksLayoutProps {
    children: ReactNode;
}
export default function BooksLayout({ children }: BooksLayoutProps) {
    return <div>{children}</div>;
}
