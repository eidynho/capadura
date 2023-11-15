import { ReactNode, Suspense } from "react";
import { Metadata } from "next";

import { BASE_URL } from "@/constants/api";

import Loading from "./loading";

interface ProfileLayoutProps {
    children: ReactNode;
    params: {
        username: string;
    };
}

export function generateMetadata({ params }: ProfileLayoutProps): Metadata {
    return {
        title: {
            template: `${params.username}: %s | Capadura`,
            default: `${params.username}`,
        },
        alternates: {
            canonical: `${BASE_URL}/@${params.username}`,
        },
    };
}

export default async function ProfileLayout({ children }: ProfileLayoutProps) {
    return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
