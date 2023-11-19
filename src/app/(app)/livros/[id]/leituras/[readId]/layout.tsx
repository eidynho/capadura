import { ReactNode, Suspense } from "react";
import { Metadata } from "next";

import { BASE_URL } from "@/constants/api";

import Loading from "./loading";

interface BookLayoutProps {
    children: ReactNode;
    params: {
        id: string;
        readId: string;
    };
}

export function generateMetadata({ params }: BookLayoutProps): Metadata {
    return {
        title: "leituras",
        alternates: {
            canonical: `${BASE_URL}/livros/${params.id}/leituras/${params.readId}`,
        },
    };
}

export default async function BookReadLayout({ children }: BookLayoutProps) {
    return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
