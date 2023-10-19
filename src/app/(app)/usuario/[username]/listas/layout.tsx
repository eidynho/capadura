import { ReactNode } from "react";
import { Metadata } from "next";

import { BASE_URL } from "@/constants/api";

interface UserListsLayoutProps {
    children: ReactNode;
    params: {
        username: string;
    };
}

export function generateMetadata({ params }: UserListsLayoutProps): Metadata {
    return {
        title: "listas",
        alternates: {
            canonical: `${BASE_URL}/@${params.username}/listas`,
        },
    };
}

export default async function UserListsLayout({ children }: UserListsLayoutProps) {
    return <>{children}</>;
}
