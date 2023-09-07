import { ReactNode } from "react";
import { cookies as NextCookies } from "next/headers";
import { redirect } from "next/navigation";

interface InviteAndWinLayoutProps {
    children: ReactNode;
}

export default async function InviteAndWinLayout({ children }: InviteAndWinLayoutProps) {
    const cookies = NextCookies();
    const token = cookies.get("token");

    if (!!token) {
        return <>{children}</>;
    } else {
        redirect("/livros");
    }
}
