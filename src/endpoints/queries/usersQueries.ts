import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { ProfileData } from "@/contexts/AuthContext";

interface UseFetchUserByUsernameProps {
    username: string;
    enabled?: boolean;
}

export function useFetchUserByUsername({ username, enabled = true }: UseFetchUserByUsernameProps) {
    return useQuery({
        queryKey: ["fetchUserByUsername", { username }],
        queryFn: async () => {
            const { data } = await api.get(`/users/${username}`);

            return data as ProfileData;
        },
        enabled,
    });
}
