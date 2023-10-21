import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { ReadData, ReadStatus, ReadsDataResponse } from "../queries/readsQueries";
import { GetMetadataCount } from "@/app/(app)/livros/[id]/components/BookMetaData";

import { useToast } from "@/components/ui/UseToast";

interface UseStartNewReadProps {
    bookId: string;
}

export function useStartNewRead() {
    const queryClient = useQueryClient();

    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ bookId }: UseStartNewReadProps) => {
            const { data } = await api.post<ReadData>("/read", {
                bookId,
            });

            return data;
        },
        onSuccess: (newData, { bookId }) => {
            queryClient.setQueryData<ReadsDataResponse>(
                ["fetchUserReadsByBook", { bookId }],
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

            toast({
                title: "Uma leitura foi iniciada.",
                description: "Adicione progressos para completar a leitura.",
            });
        },
        onError: () => {
            toast({
                title: "Erro ao iniciar a leitura.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on start new read.");
        },
    });
}

interface UseUpdateReadProps {
    userId: string;
    bookId: string;
    readId: string;
    status: ReadStatus;
    reviewContent?: string;
    reviewRating: number | null;
    reviewIsSpoiler: boolean;
    endRead: boolean;
}

export function useUpdateRead() {
    const queryClient = useQueryClient();

    const { toast } = useToast();

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
            {
                userId,
                bookId,
                readId,
                status,
                reviewContent,
                reviewRating,
                reviewIsSpoiler,
                endRead,
            },
        ) => {
            const updateReadsQueryData = (prevData?: ReadsDataResponse) => {
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
            };

            // user reads in book page
            queryClient.setQueryData<ReadsDataResponse>(
                ["fetchUserReadsByBook", { bookId }],
                (prevData) => updateReadsQueryData(prevData),
            );

            // user reads in user profile
            queryClient.setQueryData<ReadsDataResponse>(
                ["fetchUserReadsByStatus", { userId }],
                (prevData) => updateReadsQueryData(prevData),
            );

            // read id page
            queryClient.setQueryData<ReadData>(["fetchRead", { readId }], (prevData) => {
                if (!prevData) return;

                const updatedRead = { ...(prevData || {}) };

                updatedRead.status = status;
                updatedRead.reviewContent = reviewContent || null;
                updatedRead.reviewRating = reviewRating;
                updatedRead.reviewIsSpoiler = reviewIsSpoiler;

                if (endRead) {
                    updatedRead.endDate = new Date().toISOString();
                }

                return updatedRead;
            });

            // is status is abount to change for "FINISHED", add total finished read count metadata count by one
            if (status === "FINISHED") {
                queryClient.setQueriesData<GetMetadataCount>(
                    ["getTotalFinishedReadsCountByBook", { bookId }],
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
            }

            // rating charts component
            queryClient.invalidateQueries({
                queryKey: ["fetchReadsRating"],
                refetchType: "none",
            });

            // user ratings page
            queryClient.invalidateQueries({
                queryKey: ["fetchReadsByReviewRatingsAndUser"],
                refetchType: "none",
            });

            toast({
                title: "Os dados da leitura foram alterados.",
            });
        },
        onError: () => {
            toast({
                title: "Erro ao editar os dados da leitura.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on update read data.");
        },
    });
}

interface UseDeleteReadProps {
    bookId: string;
    readId: string;
    status: ReadStatus;
}

export function useDeleteRead() {
    const queryClient = useQueryClient();

    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ readId }: UseDeleteReadProps) => {
            await api.delete(`/read/${readId}`);
        },
        onSuccess: (_, { bookId, readId, status }) => {
            queryClient.setQueryData<ReadsDataResponse>(
                ["fetchUserReadsByBook", { bookId }],
                (prevData) => {
                    const updatedReads = { ...(prevData || {}) };

                    updatedReads.items = updatedReads.items?.filter((read) => read.id !== readId);

                    return {
                        items: updatedReads.items || [],
                        total: updatedReads.total || 0,
                    };
                },
            );

            // is read to delete is finished, reduce total finished read count metadata count by one
            if (status === "FINISHED") {
                queryClient.setQueriesData<GetMetadataCount>(
                    ["getTotalFinishedReadsCountByBook", { bookId }],
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
            }

            // book ratings page
            queryClient.invalidateQueries({
                queryKey: ["fetchReadsByReviewRatingsAndBook"],
                refetchType: "none",
            });

            toast({
                title: "A sua leitura foi excluída.",
            });
        },
        onError: () => {
            toast({
                title: "Erro ao deletar leitura.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on delete read.");
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

    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ readId, isPrivate }: UseToggleReadPrivacyProps) => {
            await api.put("/read", {
                readId,
                isPrivate: !isPrivate,
            });
        },
        onSuccess: (_, { bookId, readId }) => {
            queryClient.setQueryData<ReadsDataResponse>(
                ["fetchUserReadsByBook", { bookId }],
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

            // read id page
            queryClient.setQueryData<ReadData>(["fetchRead", { readId }], (prevData) => {
                if (!prevData) return;

                const updatedRead = { ...(prevData || {}) };

                updatedRead.isPrivate = !updatedRead.isPrivate;

                return updatedRead;
            });

            // book ratings page
            queryClient.invalidateQueries({
                queryKey: ["fetchReadsByReviewRatingsAndBook"],
                refetchType: "none",
            });

            toast({
                title: "A privacidade da leitura foi alterada.",
            });
        },
        onError: () => {
            toast({
                title: "Erro ao alterar privacidade da leitura.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on update read privacy.");
        },
    });
}

interface UseToggleReadStatusProps {
    bookId: string;
    readId: string;
    status: ReadStatus;
}

export function useToggleReadStatus() {
    const queryClient = useQueryClient();

    const { toast } = useToast();

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
                ["fetchUserReadsByBook", { bookId }],
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

            // read id page
            queryClient.setQueryData<ReadData>(["fetchRead", { readId }], (prevData) => {
                if (!prevData) return;

                const updatedRead = { ...(prevData || {}) };

                updatedRead.status = status;

                return updatedRead;
            });

            queryClient.invalidateQueries({
                queryKey: ["fetchUserReadsByStatus"],
                refetchType: "none",
            });

            toast({
                title: "O status da leitura foi alterado.",
            });
        },
        onError: () => {
            toast({
                title: "Erro ao alterar o status da leitura.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on update read status.");
        },
    });
}
