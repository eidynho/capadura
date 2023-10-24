import { ReactNode } from "react";
import { Metadata } from "next";
import { cookies as NextCookies } from "next/headers";
import { redirect } from "next/navigation";

import { BASE_URL } from "@/constants/api";

interface InviteAndWinLayoutProps {
    children: ReactNode;
}

export const metadata: Metadata = {
    title: "Convide e ganhe",
    alternates: {
        canonical: `${BASE_URL}/entrar`,
    },
};

export default async function InviteAndWinLayout({ children }: InviteAndWinLayoutProps) {
    // TODO: invite and win page
    redirect("/inicio");

    const cookies = NextCookies();
    const token = cookies.get("token");

    if (!!token) {
        return <>{children}</>;
    } else {
        redirect("/inicio");
    }
}
