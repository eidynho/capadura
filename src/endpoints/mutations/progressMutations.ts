import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { ProgressData } from "../queries/progressQueries";
import { ReadData, ReadsDataResponse } from "../queries/readsQueries";

import { useToast } from "@/components/ui/UseToast";

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

    const { toast } = useToast();

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

            // read id page
            queryClient.setQueryData<ReadData>(["fetchRead", { readId }], (prevData) => {
                if (!prevData) return;

                const updatedRead = { ...(prevData || {}) };

                if (!updatedRead.progress) {
                    updatedRead.progress = [];
                }

                updatedRead.progress.unshift(newData);

                return updatedRead;
            });

            toast({
                title: "Progresso adicionado.",
            });
        },
        onError: () => {
            toast({
                title: "Erro ao adicionar o progresso de leitura.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

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

    const { toast } = useToast();

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

            // read id page
            queryClient.setQueryData<ReadData>(["fetchRead", { readId }], (prevData) => {
                if (!prevData) return;

                const updatedRead = { ...(prevData || {}) };

                const progress = updatedRead.progress.find(
                    (progress) => progress.id === progressId,
                );
                if (!progress) {
                    return updatedRead;
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

                return updatedRead;
            });

            toast({
                title: "O progresso de leitura foi editado.",
            });
        },
        onError: () => {
            toast({
                title: "Erro ao editar o progresso de leitura.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

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

    const { toast } = useToast();

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

            // read id page
            queryClient.setQueryData<ReadData>(["fetchRead", { readId }], (prevData) => {
                if (!prevData) return;

                const updatedRead = { ...(prevData || {}) };

                updatedRead.progress = updatedRead.progress.filter(
                    (progress) => progress.id !== progressId,
                );

                return updatedRead;
            });

            toast({
                title: "O progresso de leitura foi deletado.",
            });
        },
        onError: () => {
            toast({
                title: "Erro ao deletar o progresso de leitura.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on delete read progress.");
        },
    });
}
