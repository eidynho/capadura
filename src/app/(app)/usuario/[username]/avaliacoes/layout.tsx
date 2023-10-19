import { ReactNode } from "react";
import { Metadata } from "next";
import { cookies as NextCookies } from "next/headers";
import { redirect } from "next/navigation";

import { BASE_URL } from "@/constants/api";

interface UserReviewsLayoutProps {
    children: ReactNode;
    params: {
        username: string;
    };
}

export function generateMetadata({ params }: UserReviewsLayoutProps): Metadata {
    return {
        title: "avaliações",
        alternates: {
            canonical: `${BASE_URL}/@${params.username}/avaliacoes`,
        },
    };
}

export default async function UserReviewsLayout({ children }: UserReviewsLayoutProps) {
    const cookies = NextCookies();
    const token = cookies.get("token");

    if (!!cookies && !token) {
        redirect("/entrar");
    } else {
        return <>{children}</>;
    }
}
