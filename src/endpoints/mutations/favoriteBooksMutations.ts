import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { FavoriteBooksData } from "../queries/favoriteBooksQueries";

import { useToast } from "@/components/ui/UseToast";

interface UseCreateFavoriteBookProps {
    username: string;
    order: number;
    bookId: string;
}

export function useCreateFavoriteBook() {
    const queryClient = useQueryClient();

    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ order, bookId }: UseCreateFavoriteBookProps) => {
            const { data } = await api.post<FavoriteBooksData>("/favorite-books", {
                order,
                bookId,
            });

            return data;
        },
        onSuccess: (newData, { order, username }) => {
            queryClient.setQueryData<(FavoriteBooksData | null)[]>(
                ["fetchUserFavoriteBooks", { username }],
                (prevData) => {
                    const favoriteBookToUpdate = [...(prevData || [])];

                    const index = order - 1;
                    favoriteBookToUpdate[index] = newData;

                    return favoriteBookToUpdate;
                },
            );

            toast({
                title: "Livro favorito adicionado ao perfil.",
            });
        },
        onError: () => {
            toast({
                title: "Erro ao adicionar livro favorito ao perfil.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on create favorite book.");
        },
    });
}

interface UseUpdateFavoriteBookProps {
    username: string;
    order: number;
    bookId: string;
    favoriteBookId: string;
}

export function useUpdateFavoriteBook() {
    const queryClient = useQueryClient();

    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ order, bookId, favoriteBookId }: UseUpdateFavoriteBookProps) => {
            const { data } = await api.put<FavoriteBooksData>("/favorite-books", {
                order,
                bookId,
                favoriteBookId,
            });

            return data;
        },
        onSuccess: (newData, { order, username }) => {
            queryClient.setQueryData<(FavoriteBooksData | null)[]>(
                ["fetchUserFavoriteBooks", { username }],
                (prevData) => {
                    const favoriteBookToUpdate = [...(prevData || [])];

                    const index = order - 1;
                    favoriteBookToUpdate[index] = newData;

                    return favoriteBookToUpdate;
                },
            );

            toast({
                title: "O livro favorito foi atualizado.",
            });
        },
        onError: () => {
            toast({
                title: "Erro ao salvar o livro favorito no perfil.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on update favorite book");
        },
    });
}

interface UseRemoveFavoriteBookProps {
    username: string;
    indexToRemove: number;
    bookIdToRemove: string;
}

export function useRemoveFavoriteBook() {
    const queryClient = useQueryClient();

    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ bookIdToRemove }: UseRemoveFavoriteBookProps) => {
            await api.delete(`/favorite-books/${bookIdToRemove}`);
        },
        onSuccess: (_, { username, indexToRemove }) => {
            queryClient.setQueryData<(FavoriteBooksData | null)[]>(
                ["fetchUserFavoriteBooks", { username }],
                (prevData) => {
                    const favoriteBookToUpdate = [...(prevData || [])];

                    favoriteBookToUpdate[indexToRemove] = null;

                    return favoriteBookToUpdate;
                },
            );

            toast({
                title: "O livro favorito foi removido do perfil.",
            });
        },
        onError: () => {
            toast({
                title: "Erro ao remover livro favorito do perfil.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });
            throw new Error("Failed on remove favorite book.");
        },
    });
}
