import { ReactNode } from "react";
import { Metadata } from "next";
import { cookies as NextCookies } from "next/headers";
import { redirect } from "next/navigation";

import { BASE_URL } from "@/constants/api";

interface SignUpLayoutProps {
    children: ReactNode;
}

export const metadata: Metadata = {
    title: "Criar conta",
    alternates: {
        canonical: `${BASE_URL}/criar-conta`,
    },
};

export default async function SignUpLayout({ children }: SignUpLayoutProps) {
    const cookies = NextCookies();
    const token = cookies.get("token");

    if (!token) {
        return <>{children}</>;
    } else {
        redirect("/livros");
    }
}
