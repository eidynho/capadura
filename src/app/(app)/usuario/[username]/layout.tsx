import { ReactNode, Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { API_BASE_URL, BASE_URL } from "@/constants/api";

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

const fetchUserByUsername = async (username: string) => {
    try {
        if (!username) {
            throw new Error("Username not provided.");
        }

        const response = await fetch(`${API_BASE_URL}/users/username/${username}`);
        const data = await response.json();
        console.log(`${API_BASE_URL}/users/username/${username}`, data);

        if (!data?.id) {
            throw new Error("User not found: " + data);
        }

        return data;
    } catch (err) {
        throw new Error("Failed on fetch user by username: " + err);
    }
};

export default async function ProfileLayout({ children, params }: ProfileLayoutProps) {
    try {
        await fetchUserByUsername(params.username);
    } catch (err) {
        console.error(err);
        notFound();
    }

    return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
