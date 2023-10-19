import { ReactNode } from "react";
import { Metadata } from "next";
import { cookies as NextCookies } from "next/headers";
import { redirect } from "next/navigation";

import { BASE_URL } from "@/constants/api";

interface ConfigLayoutProps {
    children: ReactNode;
}

export const metadata: Metadata = {
    title: "Configurações",
    alternates: {
        canonical: `${BASE_URL}/config`,
    },
};

export default async function ConfigLayout({ children }: ConfigLayoutProps) {
    const cookies = NextCookies();
    const token = cookies.get("token");

    if (!!cookies && !token) {
        redirect("/entrar");
    } else {
        return <>{children}</>;
    }
}
