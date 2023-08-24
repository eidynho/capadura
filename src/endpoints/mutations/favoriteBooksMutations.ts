import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { api } from "@/lib/api";

import { FavoriteBooksData } from "../queries/favoriteBooksQueries";

interface UseCreateFavoriteBookProps {
    username: string;
    order: number;
    bookId: string;
}

export function useCreateFavoriteBook() {
    const queryClient = useQueryClient();

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

            toast.success("Livro favorito adicionado.");
        },
        onError: () => {
            toast.error("Erro ao salvar livro favorito.");
            throw new Error("Failed on save favorite book.");
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

            toast.success("Livro favorito atualizado.");
        },
        onError: () => {
            toast.error("Erro ao salvar livro favorito.");
            throw new Error("Failed on save favorite book.");
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

            toast.success("Livro favorito removido.");
        },
        onError: () => {
            toast.error("Erro ao remover livro favorito.");
            throw new Error("Failed on remove favorite book.");
        },
    });
}
