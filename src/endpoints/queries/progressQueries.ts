import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { ProgressData } from "@/app/(app)/livros/[id]/page";

export interface ProgressDataResponse {
    items: ProgressData[];
    total: number;
}

interface UseFetchUserProgressProps {
    userId: string;
    page?: number;
    perPage?: number;
    enabled?: boolean;
}

export function useFetchUserProgress({
    userId,
    page = 1,
    perPage = 3,
    enabled = true,
}: UseFetchUserProgressProps) {
    return useQuery({
        queryKey: ["fetchUserProgress", { userId }],
        queryFn: async () => {
            const { data } = await api.get<ProgressDataResponse>(
                `/user-progress/${userId}?page=${page}&perPage=${perPage}`,
            );

            return data;
        },
        enabled,
    });
}
