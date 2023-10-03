import { ReactNode } from "react";
import { notFound } from "next/navigation";

import { API_BASE_URL } from "@/constants/api";

interface MeLayoutProps {
    children: ReactNode;
    params: {
        username: string;
    };
}

export function generateMetadata({ params }: MeLayoutProps) {
    return {
        title: `${params.username}`,
    };
}

const fetchUserByUsername = async (username: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${username}`);
        const data = await response.json();

        if (!data.id) {
            throw new Error("Username not found");
        }

        return data;
    } catch (err) {
        throw new Error("Failed on fetch user by username");
    }
};

export default async function MeLayout({ children, params }: MeLayoutProps) {
    try {
        await fetchUserByUsername(params.username);
    } catch (err) {
        notFound();
    }

    return <>{children}</>;
}
