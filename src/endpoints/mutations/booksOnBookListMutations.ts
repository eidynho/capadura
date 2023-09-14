import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { api } from "@/lib/api";

import { BookListData } from "../queries/bookListsQueries";
import { BookOnBookList, BookOnBookListWithBook } from "@/app/(app)/usuario/[username]/listas/page";
import { GetMetadataCount } from "@/app/(app)/livros/[id]/components/BookMetaData";

export interface UseAddBookToABookListProps {
    userId: string;
    bookId: string;
    bookListId: string;
}

export function useAddBookToABookList() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ bookId, bookListId }: UseAddBookToABookListProps) => {
            const { data } = await api.post<BookOnBookList>("/books-on-booklists", {
                bookId,
                bookListId,
            });

            return data;
        },
        onSuccess: (newBook, { userId, bookId, bookListId }) => {
            // booklists dropdown in book page (add check icon)
            queryClient.setQueryData<BookListData[]>(
                ["fetchUserBookListsIncludeBook", { userId, bookId }],
                (prevData) => {
                    const updatedBookList = [...(prevData || [])];
                    const bookListToUpdate = updatedBookList.find((item) => item.id === bookListId);

                    if (!bookListToUpdate) return updatedBookList;

                    if (!bookListToUpdate.books) {
                        bookListToUpdate.books = [];
                    }

                    bookListToUpdate.books.unshift(newBook);

                    return updatedBookList;
                },
            );

            // user lists page in books on booklist table
            queryClient.invalidateQueries({
                queryKey: ["fetchBooksOnBookList", { bookListId }],
                refetchType: "none",
            });

            // update book metadata total count
            queryClient.setQueriesData<GetMetadataCount>(
                ["getTotalListsWithSomeBookCount", { bookId }],
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
        },
        onError: () => {
            toast.error("Erro ao adicionar livro na lista.");
            throw new Error("Failed on add book in booklist.");
        },
    });
}

export interface UseRemoveBookFromBookListProps {
    userId?: string;
    bookId: string;
    bookListId?: string;
    bookOnBookListId: string;
}

export function useRemoveBookFromBookList() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ bookOnBookListId }: UseRemoveBookFromBookListProps) => {
            await api.delete(`/books-on-booklists/${bookOnBookListId}`);
        },
        onSuccess: (_, { userId, bookId, bookListId }) => {
            // booklists dropdown in book page (remove check icon)
            if (userId) {
                queryClient.setQueryData<BookListData[]>(
                    ["fetchUserBookListsIncludeBook", { userId, bookId }],
                    (prevData) => {
                        const updatedBookList = [...(prevData || [])];
                        const bookListToUpdate = updatedBookList.find(
                            (item) => item.id === bookListId,
                        );

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
            }

            // user lists page in books on booklist table
            queryClient.setQueryData<BookOnBookListWithBook[]>(
                ["fetchBooksOnBookList", { bookListId }],
                (prevData) => {
                    const updatedBooksOnBookList = [...(prevData || [])];

                    return updatedBooksOnBookList.filter(
                        (booksOnBookList) => booksOnBookList.bookId !== bookId,
                    );
                },
            );

            // update book metadata total count
            queryClient.setQueriesData<GetMetadataCount>(
                ["getTotalListsWithSomeBookCount", { bookId }],
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
        },
        onError: () => {
            toast.error("Erro ao remover livro da lista.");
            throw new Error("Failed on remove book from booklist.");
        },
    });
}
