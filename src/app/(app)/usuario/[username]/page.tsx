import { notFound } from "next/navigation";

import { API_BASE_URL } from "@/constants/api";

import { ClientUser } from "./_components/ClientUser";

interface UserProps {
    params: {
        username: string;
    };
}

const fetchUserByUsername = async (username: string) => {
    try {
        if (!username) {
            throw new Error("Username not provided.");
        }

        if (username.endsWith(".prefetch")) {
            username = username.replace(".prefetch", "");
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

export default async function User({ params }: UserProps) {
    try {
        await fetchUserByUsername(params.username);
    } catch (err) {
        console.error(err);
        notFound();
    }

    return <ClientUser username={params.username} />;
}
