import { ReactNode } from "react";
import { cookies as NextCookies } from "next/headers";
import { redirect } from "next/navigation";

interface SignUpLayoutProps {
    children: ReactNode;
}

export default async function SignUpLayout({ children }: SignUpLayoutProps) {
    const cookies = NextCookies();
    const token = cookies.get("token");

    if (!token) {
        return <>{children}</>;
    } else {
        redirect("/livros");
    }
}
