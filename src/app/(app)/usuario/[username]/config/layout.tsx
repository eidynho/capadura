import { ReactNode } from "react";
import { cookies as NextCookies } from "next/headers";
import { redirect } from "next/navigation";

interface ConfigLayoutProps {
    children: ReactNode;
}

export default async function ConfigLayout({ children }: ConfigLayoutProps) {
    const cookies = NextCookies();
    const token = cookies.get("token");

    if (!token) {
        redirect("/entrar");
    } else {
        return <>{children}</>;
    }
}
