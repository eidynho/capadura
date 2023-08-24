import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { api } from "@/lib/api";

import { LikeBook } from "../queries/likeBookQueries";

export interface UseAddLikeBookProps {
    bookId: string;
}

export function useAddLikeBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ bookId }: UseAddLikeBookProps) => {
            const { data } = await api.post<LikeBook>("/likes", {
                bookId,
            });

            return data.like;
        },
        onSuccess: (newData, { bookId }) => {
            queryClient.setQueryData(["getUserLikedBook", { bookId }], () => {
                return newData;
            });
        },
        onError: () => {
            toast.error("Erro ao curtir livro.");
        },
    });
}

export interface UseDislikeBookProps {
    bookId: string;
    likeId: string;
}

export function useDislikeBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ likeId }: UseDislikeBookProps) => {
            await api.delete(`/likes/${likeId}`);
        },
        onSuccess: (_, { bookId }) => {
            queryClient.setQueryData(["getUserLikedBook", { bookId }], () => {
                return null;
            });
        },
        onError: () => {
            toast.error("Erro ao descurtir livro.");
        },
    });
}
