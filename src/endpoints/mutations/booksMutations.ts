import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { BookData } from "@/endpoints/queries/booksQueries";

export interface UseCreateBookProps {
    bookId: string;
}

export function useCreateBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ bookId }: UseCreateBookProps) => {
            const { data } = await api.post("/book", {
                bookId,
            });

            return data as BookData;
        },
        onSuccess: (newData, { bookId }) => {
            queryClient.setQueryData<BookData>(["fetchBook", { bookId }], () => newData);
        },
        onError: () => {
            throw new Error("Failed on create book.");
        },
    });
}

export interface UseUpdateBookImageProps {
    bookId: string;
    imageLink: string;
}

export function useUpdateBookImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ bookId, imageLink }: UseUpdateBookImageProps) => {
            const { data } = await api.put(`/book/${bookId}`, {
                id: bookId,
                imageLink,
            });

            return data as BookData;
        },
        onSuccess: (newData, { bookId }) => {
            queryClient.setQueryData<BookData>(["fetchBook", { bookId }], (prevData) => {
                if (!prevData) return;

                const updatedBook = { ...prevData };

                updatedBook.imageKey = newData.imageKey;
                updatedBook.imageUrl = newData.imageUrl;

                return updatedBook;
            });
        },
        onError: () => {
            throw new Error("Failed on update book image.");
        },
    });
}
