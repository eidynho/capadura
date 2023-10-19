import { ReactNode } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { API_BASE_URL, BASE_URL } from "@/constants/api";

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

const fetchUserByUsername = async (username: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/username/${username}`);
        const data = await response.json();

        if (!data.id) {
            throw new Error("Username not found");
        }

        return data;
    } catch (err) {
        throw new Error("Failed on fetch user by username");
    }
};

export default async function ProfileLayout({ children, params }: ProfileLayoutProps) {
    try {
        await fetchUserByUsername(params.username);
    } catch (err) {
        notFound();
    }

    return <>{children}</>;
}
