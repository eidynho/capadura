import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { LikeBook, LikeBookWithBook } from "../queries/likeBookQueries";
import { GetMetadataCount } from "@/app/(app)/livros/[id]/components/BookMetaData";

import { useToast } from "@/components/ui/UseToast";

export interface UseAddLikeBookProps {
    bookId: string;
    userId: string;
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
        onSuccess: (newData, { bookId, userId }) => {
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

            // invalidate user likes page
            queryClient.invalidateQueries({
                queryKey: ["getBookLikesByUser", { userId }],
                refetchType: "none",
            });
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
    userId: string;
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
        onSuccess: (_, { bookId, userId }) => {
            queryClient.setQueryData(["getUserLikedBook", { bookId }], () => null);

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

            // update user likes page
            queryClient.setQueriesData<LikeBookWithBook[]>(
                ["getBookLikesByUser", { userId }],
                (prevData) => {
                    if (!prevData) {
                        return [];
                    }

                    const updatedData = prevData.filter((data) => data.bookId !== bookId);
                    return updatedData;
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
