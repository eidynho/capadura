import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { ReadData } from "@/app/(app)/livros/[id]/page";

export interface ReadsDataResponse {
    items: ReadData[];
    total: number;
}

interface UseFetchUserReadsByUserProps {
    userId: string;
    page?: number;
    perPage?: number;
    enabled?: boolean;
}

export function useFetchUserReadsByUser({
    userId,
    page = 1,
    perPage = 3,
    enabled = true,
}: UseFetchUserReadsByUserProps) {
    return useQuery({
        queryKey: ["fetchUserReadsByUser", { userId, page, perPage }],
        queryFn: async () => {
            const { data } = await api.get(
                `/user-reads?userId=${userId}&status=FINISHED&page=${page}&perPage=${perPage}`,
            );

            return data as ReadsDataResponse;
        },
        enabled,
    });
}

interface UseFetchUserReadsByBookProps {
    bookId: string;
    enabled?: boolean;
}

export function useFetchUserReadsByBook({ bookId, enabled = true }: UseFetchUserReadsByBookProps) {
    return useQuery({
        queryKey: ["fetchUserReadsByBook", { bookId }],
        queryFn: async () => {
            const { data } = await api.get(`/user-reads?bookId=${bookId}`);

            return data as ReadsDataResponse;
        },
        enabled,
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

            const { data } = await api.get(`/read/ratings${query}`);

            return data as FetchReadsRatingData;
        },
        enabled,
    });
}
