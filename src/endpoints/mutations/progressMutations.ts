import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { ProgressData, ProgressDataResponse } from "../queries/progressQueries";
import { ReadsDataResponse } from "../queries/readsQueries";

import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/UseToast";

interface UseCreateProgressProps {
    bookId: string;
    readId: string;
    description?: string;
    isSpoiler: boolean;
    pagesCount: number;
    countType: "page" | "percentage";
    bookPageCount: number;
}

export function useCreateProgress() {
    const queryClient = useQueryClient();

    const { user } = useAuthContext();
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
        }: UseCreateProgressProps) => {
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
            queryClient.invalidateQueries({
                queryKey: ["fetchReadProgress", { readId, page: 1, perPage: 30 }],
                refetchType: "none",
            });

            // home page progress pages readed
            if (user) {
                queryClient.invalidateQueries({
                    queryKey: ["getPagesReadedByDay", { userId: user.id }],
                    refetchType: "none",
                });
            }

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
    bookId: string;
}

export function useUpdateProgress() {
    const queryClient = useQueryClient();

    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ progressId, description, isSpoiler }: UseUpdateProgressProps) => {
            await api.put("/progress", {
                id: progressId,
                description,
                isSpoiler,
            });
        },
        onSuccess: (_, { progressId, readId, description, isSpoiler, bookId }) => {
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

                        progress.description = description ?? "";
                        progress.isSpoiler = isSpoiler;
                    }

                    return {
                        items: updatedReads.items || [],
                        total: updatedReads.total || 0,
                    };
                },
            );

            // read id page
            queryClient.setQueryData<ProgressDataResponse>(
                ["fetchReadProgress", { readId, page: 1, perPage: 30 }],
                (prevData) => {
                    if (!prevData) return;

                    const updatedProgress = { ...prevData };

                    const progress = updatedProgress.items.find(
                        (progress) => progress.id === progressId,
                    );

                    if (!progress) {
                        return updatedProgress;
                    }

                    progress.description = description ?? "";
                    progress.isSpoiler = isSpoiler;

                    return updatedProgress;
                },
            );

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

    const { user } = useAuthContext();
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
            queryClient.invalidateQueries({
                queryKey: ["fetchReadProgress", { readId, page: 1, perPage: 30 }],
                refetchType: "none",
            });

            // home page progress pages readed
            if (user) {
                queryClient.invalidateQueries({
                    queryKey: ["getPagesReadedByDay", { userId: user.id }],
                    refetchType: "none",
                });
            }

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
