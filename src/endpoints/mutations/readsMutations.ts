import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { api } from "@/lib/api";

import { ReadsDataResponse } from "../queries/readsQueries";
import { ReadData } from "@/app/(app)/livros/[id]/page";

interface UseStartNewReadProps {
    bookId: string;
}

export function useStartNewRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ bookId }: UseStartNewReadProps) => {
            const { data } = await api.post<ReadData>("/read", {
                bookId,
            });

            return data;
        },
        onSuccess: (newData, { bookId }) => {
            queryClient.setQueryData<ReadsDataResponse>(
                ["fetchUserReads", { bookId }],
                (prevData) => {
                    const updatedReads = { ...(prevData || {}) };

                    if (!updatedReads.items?.length) {
                        updatedReads.items = [];
                    }

                    updatedReads.items.unshift(newData);

                    return {
                        items: updatedReads.items,
                        total: updatedReads.total || 0,
                    };
                },
            );
        },
        onError: () => {
            toast.error("Erro ao iniciar a leitura.");
        },
    });
}

interface UseUpdateReadProps {
    bookId: string;
    readId: string;
    status: string;
    reviewContent?: string;
    reviewRating: number | null;
    reviewIsSpoiler: boolean;
    endRead: boolean;
}

export function useUpdateRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            bookId,
            readId,
            status,
            reviewContent,
            reviewRating,
            reviewIsSpoiler,
            endRead,
        }: UseUpdateReadProps) => {
            await api.put("/read", {
                bookId,
                readId,
                status,
                reviewContent,
                reviewRating,
                reviewIsSpoiler,
                endRead,
            });
        },
        onSuccess: (
            _,
            { bookId, readId, status, reviewContent, reviewRating, reviewIsSpoiler, endRead },
        ) => {
            queryClient.setQueryData<ReadsDataResponse>(
                ["fetchUserReads", { bookId }],
                (prevData) => {
                    const updatedReads = { ...(prevData || {}) };

                    const read = updatedReads.items?.find((read) => read.id === readId);
                    if (read) {
                        read.status = status;
                        read.reviewContent = reviewContent || null;
                        read.reviewRating = reviewRating;
                        read.reviewIsSpoiler = reviewIsSpoiler;

                        if (endRead) {
                            read.endDate = new Date().toISOString();
                        }
                    }

                    return {
                        items: updatedReads.items || [],
                        total: updatedReads.total || 0,
                    };
                },
            );
        },
        onError: () => {
            toast.error("Erro ao alterar dados da leitura.");
        },
    });
}

interface UseToggleReadPrivacyProps {
    bookId: string;
    readId: string;
    isPrivate: boolean;
}

export function useToggleReadPrivacy() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ readId, isPrivate }: UseToggleReadPrivacyProps) => {
            await api.put("/read", {
                readId,
                isPrivate: !isPrivate,
            });
        },
        onSuccess: (_, { bookId, readId }) => {
            queryClient.setQueryData<ReadsDataResponse>(
                ["fetchUserReads", { bookId }],
                (prevData) => {
                    const updatedReads = { ...(prevData || {}) };

                    const read = updatedReads.items?.find((read) => read.id === readId);
                    if (read) {
                        read.isPrivate = !read.isPrivate;
                    }

                    return {
                        items: updatedReads.items || [],
                        total: updatedReads.total || 0,
                    };
                },
            );

            toast.success("A privacidade da leitura foi alterada.");
        },
        onError: () => {
            toast.error("Erro ao alterar privacidade da leitura.");
        },
    });
}

interface UseToggleReadStatusProps {
    bookId: string;
    readId: string;
    status: ReadStatus;
}

export type ReadStatus = "ACTIVE" | "FINISHED" | "CANCELLED" | "DELETED";

export function useToggleReadStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ bookId, readId, status }: UseToggleReadStatusProps) => {
            await api.put("/read", {
                bookId,
                readId,
                status,
            });
        },
        onSuccess: (_, { bookId, readId, status }) => {
            queryClient.setQueryData<ReadsDataResponse>(
                ["fetchUserReads", { bookId }],
                (prevData) => {
                    const updatedReads = { ...(prevData || {}) };

                    const read = updatedReads.items?.find((read) => read.id === readId);
                    if (read) {
                        read.status = status;
                    }

                    return {
                        items: updatedReads.items || [],
                        total: updatedReads.total || 0,
                    };
                },
            );

            toast.success("O status da leitura foi alterado.");
        },
        onError: () => {
            toast.error("Erro ao alterar o status da leitura.");
        },
    });
}
