import { ReactNode } from "react";
import { Metadata } from "next";
import { cookies as NextCookies } from "next/headers";
import { redirect } from "next/navigation";

import { BASE_URL } from "@/constants/api";

interface AppHomeLayoutProps {
    children: ReactNode;
}

export const metadata: Metadata = {
    title: "Início",
    alternates: {
        canonical: `${BASE_URL}/inicio`,
    },
};

export default async function AppHomeLayout({ children }: AppHomeLayoutProps) {
    const cookies = NextCookies();
    const token = cookies.get("token");

    if (!!cookies && !token) {
        redirect("/entrar");
    } else {
        return <>{children}</>;
    }
}
