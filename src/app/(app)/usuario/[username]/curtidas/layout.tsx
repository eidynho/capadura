import { ReactNode } from "react";
import { Metadata } from "next";

import { BASE_URL } from "@/constants/api";

interface UserLikesLayoutProps {
    children: ReactNode;
    params: {
        username: string;
    };
}

export function generateMetadata({ params }: UserLikesLayoutProps): Metadata {
    return {
        title: "curtidas",
        alternates: {
            canonical: `${BASE_URL}/@${params.username}/curtidas`,
        },
    };
}

export default async function UserLikesLayout({ children }: UserLikesLayoutProps) {
    return <>{children}</>;
}
