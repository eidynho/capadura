import { ReactNode } from "react";
import { Metadata } from "next";

import { BASE_URL } from "@/constants/api";

interface ProfileLayoutProps {
    children: ReactNode;
    params: {
        username: string;
    };
}

export function generateMetadata({ params }: ProfileLayoutProps): Metadata {
    let username = params.username;
    if (username.endsWith(".prefetch")) {
        username = username.replace(".prefetch", "");
    }

    return {
        title: {
            template: `${username}: %s | Capadura`,
            default: `${username}`,
        },
        alternates: {
            canonical: `${BASE_URL}/@${username}`,
        },
    };
}

export default async function ProfileLayout({ children }: ProfileLayoutProps) {
    return <>{children}</>;
}
