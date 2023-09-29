import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { BookListData } from "../queries/bookListsQueries";

import { useToast } from "@/components/ui/UseToast";

export interface UseCreateBookListProps {
    userId: string;
    name: string;
    description?: string;
    image?: any;
}

export function useCreateBookList() {
    const queryClient = useQueryClient();

    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ name, description, image }: UseCreateBookListProps) => {
            const { data } = await api.postForm("/booklists", {
                name,
                description,
                image,
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
            toast({
                title: "Erro ao criar lista.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on create booklist.");
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

    const { toast } = useToast();

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

            toast({
                title: "Lista atualizada com sucesso.",
            });
        },
        onError: () => {
            toast({
                title: "Erro ao atualizar a lista.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on update booklist.");
        },
    });
}

interface UseDeleteBookListProps {
    userId: string;
    bookListId: string;
}

export function useDeleteBookList() {
    const queryClient = useQueryClient();

    const { toast } = useToast();

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
        onError: () => {
            toast({
                title: "Erro ao deletar lista.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on delete booklist.");
        },
    });
}
