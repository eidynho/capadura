import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export interface LikeBookWithBook {
    id: string;
    userId: string;
    bookId: string;
    createdAt: string;
    book: {
        id: string;
        title: string;
        authors: string[];
        publishDate: string;
        pageCount: number;
        imageKey?: string;
        imageUrl?: string;
    };
}

interface UseGetBookLikesByUserProps {
    userId: string;
    enabled?: boolean;
}

export function useGetBookLikesByUser({ userId, enabled = true }: UseGetBookLikesByUserProps) {
    return useQuery({
        queryKey: ["getBookLikesByUser", { userId }],
        queryFn: async () => {
            const { data } = await api.get(`/likes/user/${userId}`);

            return data as LikeBookWithBook[];
        },
        enabled,
    });
}

export interface LikeBook {
    id: string;
    userId: string;
    bookId: string;
    createdAt: string;
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
