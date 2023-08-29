import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export interface LikeBook {
    id: string;
    bookId: string;
    userId: string;
}

interface UseGetUserLikedBookProps {
    bookId: string;
    enabled?: boolean;
}

export function useGetUserLikedBook({ bookId, enabled = true }: UseGetUserLikedBookProps) {
    return useQuery({
        queryKey: ["getUserLikedBook", { bookId }],
        queryFn: async () => {
            const { data } = await api.get(`/likes/book/${bookId}`);

            return data.like as LikeBook | null;
        },
        enabled,
        staleTime: Infinity,
    });
}
