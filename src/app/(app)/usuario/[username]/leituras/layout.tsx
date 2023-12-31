import { ReactNode } from "react";
import { Metadata } from "next";
import { cookies as NextCookies } from "next/headers";
import { redirect } from "next/navigation";

import { BASE_URL } from "@/constants/api";

interface UserReadsLayoutProps {
    children: ReactNode;
    params: {
        username: string;
    };
}

export function generateMetadata({ params }: UserReadsLayoutProps): Metadata {
    return {
        title: "leituras",
        alternates: {
            canonical: `${BASE_URL}/@${params.username}/leituras`,
        },
    };
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
