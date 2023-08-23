import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { api } from "@/lib/api";

import { BookListData, BookOnBookList } from "@/app/(app)/usuario/[username]/listas/page";

export interface UseCreateBookListMutationProps {
    userId: string;
    bookId: string;
    currentBooklistCount: number;
}

export function useCreateBookListMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ currentBooklistCount }: UseCreateBookListMutationProps) => {
            const { data } = await api.post("/booklists", {
                name: `Lista ${currentBooklistCount + 1}`,
            });

            return data;
        },
        onSuccess: (newBookList, { userId, bookId }) => {
            queryClient.setQueryData<BookListData[]>(
                ["fetchBookLists", { userId, bookId }],
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

export interface UseAddBookToABookListMutationProps {
    userId: string;
    bookId: string;
    bookListId: string;
}

export function useAddBookToABookListMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ bookId, bookListId }: UseAddBookToABookListMutationProps) => {
            const { data } = await api.post<BookOnBookList>("/books-on-booklists", {
                bookId,
                bookListId,
            });

            return data;
        },
        onSuccess: (newBookList, { userId, bookId, bookListId }) => {
            queryClient.setQueryData<BookListData[]>(
                ["fetchBookLists", { userId, bookId }],
                (prevData) => {
                    const updatedBookList = [...(prevData || [])];
                    const bookListToUpdate = updatedBookList.find((item) => item.id === bookListId);

                    if (!bookListToUpdate) return updatedBookList;

                    if (!bookListToUpdate.books) {
                        bookListToUpdate.books = [];
                    }

                    bookListToUpdate.books.unshift(newBookList);

                    return updatedBookList;
                },
            );
        },
        onError: () => {
            toast.error("Erro ao adicionar livro na lista.");
        },
    });
}

export interface UseRemoveBookFromBookListMutationProps {
    userId: string;
    bookId: string;
    bookListId: string;
    bookOnBookListId: string;
}

export function useRemoveBookFromBookListMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ bookOnBookListId }: UseRemoveBookFromBookListMutationProps) => {
            await api.delete(`/books-on-booklists/${bookOnBookListId}`);
        },
        onSuccess: (_, { userId, bookId, bookListId }) => {
            queryClient.setQueryData<BookListData[]>(
                ["fetchBookLists", { userId, bookId }],
                (prevData) => {
                    const updatedBookList = [...(prevData || [])];
                    const bookListToUpdate = updatedBookList.find((item) => item.id === bookListId);

                    if (!bookListToUpdate) return updatedBookList;

                    const bookOnBookList = bookListToUpdate.books.find(
                        (item) => item.bookId === bookId,
                    );

                    if (bookOnBookList) {
                        bookListToUpdate.books = bookListToUpdate.books.filter(
                            (item) => item.bookId !== bookId,
                        );
                    }

                    return updatedBookList;
                },
            );
        },
        onError: () => {
            toast.error("Erro ao adicionar livro na lista.");
        },
    });
}
