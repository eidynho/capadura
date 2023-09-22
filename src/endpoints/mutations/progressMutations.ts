import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { api } from "@/lib/api";

import { ProgressData } from "../queries/progressQueries";
import { ReadsDataResponse } from "../queries/readsQueries";

interface UseAddNewProgressProps {
    bookId: string;
    readId: string;
    description?: string;
    isSpoiler: boolean;
    pagesCount: number;
    countType: "page" | "percentage";
    bookPageCount: number;
}

export function useAddNewProgress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            bookId,
            readId,
            description,
            isSpoiler,
            pagesCount,
            countType,
            bookPageCount,
        }: UseAddNewProgressProps) => {
            const { data } = await api.post<ProgressData>("/progress", {
                bookId,
                readId,
                description,
                isSpoiler,
                pagesCount,
                countType,
                bookPageCount,
            });

            return data;
        },
        onSuccess: (newData, { bookId, readId }) => {
            queryClient.setQueryData<ReadsDataResponse>(
                ["fetchUserReadsByBook", { bookId }],
                (prevData) => {
                    const updatedReads = { ...(prevData || {}) };

                    const read = updatedReads.items?.find((read) => read.id === readId);
                    if (read) {
                        if (!read.progress) {
                            read.progress = [];
                        }

                        if (read.progress.length === 3) {
                            read.progress.pop();
                        }

                        read.progress.unshift(newData);
                    }

                    return {
                        items: updatedReads.items || [],
                        total: updatedReads.total || 0,
                    };
                },
            );

            toast.success("Progresso adicionado.");
        },
        onError: () => {
            toast.error("Erro ao adicionar o progresso de leitura.");
            throw new Error("Failed on add new read progress.");
        },
    });
}

interface UseUpdateProgressProps {
    progressId: string;
    readId: string;
    description?: string;
    isSpoiler: boolean;
    pagesCount: number;
    countType: string;
    bookPageCount: number;
    bookId: string;
}

export function useUpdateProgress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            progressId,
            description,
            isSpoiler,
            pagesCount,
            countType,
            bookPageCount,
        }: UseUpdateProgressProps) => {
            await api.put("/progress", {
                id: progressId,
                description,
                isSpoiler,
                pagesCount,
                countType,
                bookPageCount,
            });
        },
        onSuccess: (
            _,
            {
                progressId,
                readId,
                description,
                isSpoiler,
                pagesCount,
                countType,
                bookPageCount,
                bookId,
            },
        ) => {
            queryClient.setQueryData<ReadsDataResponse>(
                ["fetchUserReadsByBook", { bookId }],
                (prevData) => {
                    const updatedReads = { ...(prevData || {}) };

                    const read = updatedReads.items?.find((read) => read.id === readId);
                    if (read) {
                        const progress = read.progress.find(
                            (progress) => progress.id === progressId,
                        );
                        if (!progress) {
                            return {
                                items: updatedReads.items || [],
                                total: updatedReads.total || 0,
                            };
                        }

                        let page = 0;
                        let percentage = 0;
                        if (countType === "page") {
                            page = Math.round(pagesCount);
                            percentage = Math.round((pagesCount / bookPageCount) * 100);
                        }

                        if (countType === "percentage") {
                            page = Math.round((bookPageCount / 100) * pagesCount);
                            percentage = Math.round(pagesCount);
                        }

                        if (percentage >= 100) {
                            page = bookPageCount;
                            percentage = 100;
                        }

                        progress.description = description ?? "";
                        progress.isSpoiler = isSpoiler;
                        progress.page = page;
                        progress.percentage = percentage;
                    }

                    return {
                        items: updatedReads.items || [],
                        total: updatedReads.total || 0,
                    };
                },
            );

            toast.success("Progresso alterado.");
        },
        onError: () => {
            toast.error("Erro ao alterar o progresso de leitura.");
            throw new Error("Failed on update read progress.");
        },
    });
}

interface UseDeleteProgressProps {
    progressId: string;
    readId: string;
    bookId: string;
}

export function useDeleteProgress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ progressId }: UseDeleteProgressProps) => {
            await api.delete(`/progress/${progressId}`);
        },
        onSuccess: (_, { progressId, readId, bookId }) => {
            queryClient.setQueryData<ReadsDataResponse>(
                ["fetchUserReadsByBook", { bookId }],
                (prevData) => {
                    const updatedReads = { ...(prevData || {}) };

                    const read = updatedReads.items?.find((read) => read.id === readId);

                    if (read) {
                        read.progress = read.progress.filter(
                            (progress) => progress.id !== progressId,
                        );
                    }

                    return {
                        items: updatedReads.items || [],
                        total: updatedReads.total || 0,
                    };
                },
            );

            toast.success("Progresso deletado.");
        },
        onError: () => {
            toast.error("Erro ao deletar o progresso de leitura.");
            throw new Error("Failed on delete read progress.");
        },
    });
}
