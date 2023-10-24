import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { BookData } from "./booksQueries";
import { ProgressData } from "./progressQueries";
import { ProfileDataResponse } from "./usersQueries";

export type ReadStatus = "ACTIVE" | "FINISHED" | "CANCELLED" | "DELETED";
export interface ReadData {
    id: string;
    bookId: string;
    startDate: string;
    endDate: string | null;
    isPrivate: boolean;
    reviewContent: string | null;
    reviewRating: number | null;
    reviewIsSpoiler: boolean | null;
    userId: string;
    status: ReadStatus;
    progress: ProgressData[];
    book?: BookData;
    user?: ProfileDataResponse;
}

export interface ReadsDataResponse {
    items: ReadData[];
    total: number;
}

interface useFetchUserReadsByStatusProps {
    userId: string;
    status: ReadStatus;
    page?: number;
    perPage?: number;
    enabled?: boolean;
}

export function useFetchUserReadsByStatus({
    userId,
    status,
    page = 1,
    perPage = 3,
    enabled = true,
}: useFetchUserReadsByStatusProps) {
    return useQuery({
        queryKey: ["fetchUserReadsByStatus", { userId, status, page, perPage }],
        queryFn: async () => {
            const { data } = await api.get(
                `/user-reads?userId=${userId}&status=${status}&page=${page}&perPage=${perPage}`,
            );

            return data as ReadsDataResponse;
        },
        enabled,
        staleTime: Infinity,
    });
}

interface useFetchReadsByBookProps {
    bookId: string;
    page?: number;
    perPage?: number;
    enabled?: boolean;
}

export function useFetchReadsByBook({
    bookId,
    page = 1,
    perPage = 5,
    enabled = true,
}: useFetchReadsByBookProps) {
    return useQuery({
        queryKey: ["fetchReadsByBook", { bookId, page, perPage }],
        queryFn: async () => {
            const { data } = await api.get(`/book/${bookId}/reads?page=${page}&perPage=${perPage}`);

            return data as ReadsDataResponse;
        },
        enabled,
        staleTime: Infinity,
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

interface UseFetchManyFinishedReadsProps {
    page?: number;
    perPage?: number;
    enabled?: boolean;
}

export function useFetchManyFinishedReads({
    page = 1,
    perPage = 30,
    enabled = true,
}: UseFetchManyFinishedReadsProps) {
    return useQuery({
        queryKey: ["fetchManyFinishedReads"],
        queryFn: async () => {
            const { data } = await api.get(`/reads/finished-reads?page=${page}&perPage=${perPage}`);

            return data as ReadsDataResponse;
        },
        enabled,
    });
}

export type RatingsOptions = "0.5" | "1" | "1.5" | "2" | "2.5" | "3" | "3.5" | "4" | "4.5" | "5";

interface UseFetchReadsByReviewRatingsAndUserProps {
    rating: RatingsOptions;
    userId: string;
    page: number;
    perPage: number;
    enabled?: boolean;
}

export function useFetchReadsByReviewRatingsAndUser({
    rating,
    userId,
    page = 1,
    perPage = 20,
    enabled = true,
}: UseFetchReadsByReviewRatingsAndUserProps) {
    return useQuery({
        queryKey: ["fetchReadsByReviewRatingsAndUser", { rating, userId, page, perPage }],
        queryFn: async () => {
            const { data } = await api.get(
                `/user/${userId}/read-ratings/${rating}?page=${page}&perPage=${perPage}`,
            );

            return data as ReadsDataResponse;
        },
        enabled,
    });
}

interface UseFetchReadsByReviewRatingsAndBookProps {
    rating: RatingsOptions;
    bookId: string;
    page: number;
    perPage: number;
    enabled?: boolean;
}

export function useFetchReadsByReviewRatingsAndBook({
    rating,
    bookId,
    page = 1,
    perPage = 20,
    enabled = true,
}: UseFetchReadsByReviewRatingsAndBookProps) {
    return useQuery({
        queryKey: ["fetchReadsByReviewRatingsAndBook", { rating, bookId, page, perPage }],
        queryFn: async () => {
            const { data } = await api.get(
                `/book/${bookId}/read-ratings/${rating}?page=${page}&perPage=${perPage}`,
            );

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
        queryKey: ["fetchReadsRating", { bookId, userId }],
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
