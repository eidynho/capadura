import { ReactNode } from "react";
import { cookies as NextCookies } from "next/headers";
import { redirect } from "next/navigation";

interface UserReadsLayoutProps {
    children: ReactNode;
}

export default async function UserReadsLayout({ children }: UserReadsLayoutProps) {
    const cookies = NextCookies();
    const token = cookies.get("token");

    if (!!cookies && !token) {
        redirect("/entrar");
    } else {
        return <>{children}</>;
    }
}
