import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { BookData } from "./booksQueries";
import { ProgressData } from "./progressQueries";

export type ReadStatus = "ACTIVE" | "FINISHED" | "CANCELLED" | "DELETED";
export interface ReadData {
    id: string;
    bookId: string;
    startDate: Date | string;
    endDate: Date | string | null;
    isPrivate: boolean;
    reviewContent: string | null;
    reviewRating: number | null;
    reviewIsSpoiler: boolean | null;
    userId: string;
    status: ReadStatus;
    progress: ProgressData[];
    book?: BookData;
}

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
        queryKey: ["fetchUserReadsByUser", { userId }],
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
            const { data } = await api.get(`/user-reads/book/${bookId}`);

            return data as ReadsDataResponse;
        },
        enabled,
    });
}

interface UseFetchReadProps {
    readId: string;
    enabled?: boolean;
}

export function useFetchRead({ readId, enabled = true }: UseFetchReadProps) {
    return useQuery({
        queryKey: ["fetchRead", { readId }],
        queryFn: async () => {
            const { data } = await api.get(`/read/${readId}`);

            return data as ReadData;
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
