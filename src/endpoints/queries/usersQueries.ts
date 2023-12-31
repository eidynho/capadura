import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export interface ProfileDataResponse {
    id: string;
    name: string;
    username: string;
    email: string;
    createdAt?: string;
    description: string | null;
    location: string | null;
    website: string | null;
    twitter: string | null;
    imageKey: string | null;
    imageUrl?: string;
}

interface UseFetchCurrentUserProps {
    enabled?: boolean;
}

export function useFetchCurrentUser({ enabled = true }: UseFetchCurrentUserProps) {
    return useQuery({
        queryKey: ["fetchCurrentUser"],
        queryFn: async () => {
            const { data } = await api.get("/me");

            return data as ProfileDataResponse;
        },
        enabled,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}

interface UseFetchUserByIdProps {
    userId: string;
    enabled?: boolean;
}

export function useFetchUserById({ userId, enabled = true }: UseFetchUserByIdProps) {
    return useQuery({
        queryKey: ["fetchUserById", { userId }],
        queryFn: async () => {
            const { data } = await api.get(`/users/id/${userId}`);

            return data as ProfileDataResponse;
        },
        enabled,
    });
}

interface UseFetchUserByUsernameProps {
    username: string;
    enabled?: boolean;
}

export function useFetchUserByUsername({ username, enabled = true }: UseFetchUserByUsernameProps) {
    return useQuery({
        queryKey: ["fetchUserByUsername", { username }],
        queryFn: async () => {
            const { data } = await api.get(`/users/username/${username}`);

            return data as ProfileDataResponse;
        },
        enabled,
    });
}
