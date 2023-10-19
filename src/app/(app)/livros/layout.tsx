import { BASE_URL } from "@/constants/api";
import { Metadata } from "next";
import { ReactNode } from "react";

interface BooksLayoutProps {
    children: ReactNode;
}

export const metadata: Metadata = {
    title: "Livros",
    alternates: {
        canonical: `${BASE_URL}/livros`,
    },
};

export default async function BooksLayout({ children }: BooksLayoutProps) {
    return <>{children}</>;
}
