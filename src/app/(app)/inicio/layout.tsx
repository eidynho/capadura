import { ReactNode } from "react";
import { Metadata } from "next";

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
    return <>{children}</>;
}
