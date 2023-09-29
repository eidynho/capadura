import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { LikeBook } from "../queries/likeBookQueries";
import { GetMetadataCount } from "@/app/(app)/livros/[id]/components/BookMetaData";

import { useToast } from "@/components/ui/UseToast";

export interface UseAddLikeBookProps {
    bookId: string;
}

export function useAddLikeBook() {
    const queryClient = useQueryClient();

    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ bookId }: UseAddLikeBookProps) => {
            const { data } = await api.post("/likes", {
                bookId,
            });

            return data.like as LikeBook;
        },
        onSuccess: (newData, { bookId }) => {
            queryClient.setQueryData(["getUserLikedBook", { bookId }], () => {
                return newData;
            });

            // update book likes total count
            queryClient.setQueriesData<GetMetadataCount>(
                ["getTotalLikeCountByBook", { bookId }],
                (prevData) => {
                    if (!prevData) {
                        return {
                            total: 0,
                        };
                    }

                    const updatedCount = prevData.total + 1;

                    return {
                        total: updatedCount,
                    };
                },
            );
        },
        onError: () => {
            toast({
                title: "Erro ao curtir livro.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on like book.");
        },
    });
}

export interface UseDislikeBookProps {
    bookId: string;
    likeId: string;
}

export function useDislikeBook() {
    const queryClient = useQueryClient();

    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ likeId }: UseDislikeBookProps) => {
            await api.delete(`/likes/${likeId}`);
        },
        onSuccess: (_, { bookId }) => {
            queryClient.setQueryData(["getUserLikedBook", { bookId }], () => {
                return null;
            });

            // update book likes total count
            queryClient.setQueriesData<GetMetadataCount>(
                ["getTotalLikeCountByBook", { bookId }],
                (prevData) => {
                    if (!prevData) {
                        return {
                            total: 0,
                        };
                    }

                    const updatedCount = prevData.total - 1;
                    return {
                        total: updatedCount,
                    };
                },
            );
        },
        onError: () => {
            toast({
                title: "Erro ao descurtir livro.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on dislike book.");
        },
    });
}
