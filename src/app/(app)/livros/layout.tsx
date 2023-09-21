import { ReactNode } from "react";

interface BooksLayoutProps {
    children: ReactNode;
}

export default async function BooksLayout({ children }: BooksLayoutProps) {
    return <div>{children}</div>;
}
