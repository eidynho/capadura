import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { ReadData } from "@/app/(app)/livros/[id]/page";

export interface ReadsDataResponse {
    items: ReadData[];
    total: number;
}

interface UseFetchUserReadsProps {
    bookId: string;
    enabled?: boolean;
}

export function useFetchUserReads({ bookId, enabled = true }: UseFetchUserReadsProps) {
    return useQuery({
        queryKey: ["fetchUserReads", { bookId }],
        queryFn: async () => {
            const { data } = await api.get<ReadsDataResponse>(`/user-reads?bookId=${bookId}`);

            return data;
        },
        enabled,
        staleTime: 1000 * 60 * 60 * 1, // 1 hour
    });
}

interface FetchReadsRatingData {
    data: {
        rating: number;
        amount: number;
        percentage: number;
    }[];
    total: number;
    averageRating: number;
}

interface UseFetchReadsRatingProps {
    bookId?: string;
    userId?: string;
    enabled?: boolean;
}

export function useFetchReadsRating({ bookId, userId, enabled = true }: UseFetchReadsRatingProps) {
    return useQuery({
        queryKey: ["fetchReadsRating", { bookId }],
        queryFn: async () => {
            let query = "";

            if (bookId) {
                query = `?bookId=${bookId}`;
            } else if (userId) {
                query = `?userId=${userId}`;
            }

            const { data } = await api.get<FetchReadsRatingData>(`/read/ratings${query}`);

            return data;
        },
        enabled,
        staleTime: 1000 * 60 * 60 * 1, // 1 hour
    });
}
