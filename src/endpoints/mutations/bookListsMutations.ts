import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { api } from "@/lib/api";

import { BookListData } from "@/app/(app)/usuario/[username]/listas/page";

export interface UseCreateBookListProps {
    userId: string;
    currentBooklistCount: number;
}

export function useCreateBookList() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ currentBooklistCount }: UseCreateBookListProps) => {
            const { data } = await api.post("/booklists", {
                name: `Lista ${currentBooklistCount + 1}`,
            });

            return data;
        },
        onSuccess: (newBookList, { userId }) => {
            queryClient.setQueryData<BookListData[]>(
                ["fetchUserBookLists", { userId }],
                (prevData) => {
                    return [newBookList, ...(prevData || [])];
                },
            );
        },
        onError: () => {
            toast.error("Erro ao criar lista.");
        },
    });
}

interface UseUpdateBookListProps {
    userId: string;
    activeBookList: number;
    bookListId: string;
    name: string;
    description?: string;
    image?: any;
}

export function useUpdateBookList() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ bookListId, name, description, image }: UseUpdateBookListProps) => {
            const { data } = await api.putForm("/booklists", {
                bookListId,
                name,
                description,
                image,
            });

            return data;
        },
        onSuccess: (newBookList, { userId, activeBookList, name, description, image }) => {
            // user lists page - booklist details
            queryClient.setQueryData<BookListData[]>(
                ["fetchUserBookLists", { userId }],
                (prevData) => {
                    const updatedBookLists = [...(prevData || [])];

                    updatedBookLists[activeBookList].name = name;

                    if (description) {
                        updatedBookLists[activeBookList].description = description;
                    }

                    if (image) {
                        updatedBookLists[activeBookList].imageUrl = newBookList.imageUrl;
                    }

                    return updatedBookLists;
                },
            );

            // booklists dropdown in book page (add check icon)
            queryClient.invalidateQueries({
                queryKey: ["fetchUserBookListsIncludeBook", { userId }],
                refetchType: "none",
            });

            toast.success("Lista atualizada com sucesso.");
        },
        onError: () => {
            toast.error("Erro ao atualizar a lista.");
        },
    });
}

interface UseDeleteBookListProps {
    userId: string;
    bookListId: string;
}

export function useDeleteBookList() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ bookListId }: UseDeleteBookListProps) => {
            await api.delete(`/booklists/${bookListId}`);
        },
        onSuccess: (_, { userId, bookListId }) => {
            // user lists page
            queryClient.setQueryData<BookListData[]>(
                ["fetchUserBookLists", { userId }],
                (prevData) => {
                    const updatedBookLists = [...(prevData || [])];

                    return updatedBookLists.filter((item) => item.id !== bookListId);
                },
            );

            // booklists dropdown in book page
            queryClient.invalidateQueries({
                queryKey: ["fetchUserBookListsIncludeBook", { userId }],
                refetchType: "none",
            });
        },
    });
}