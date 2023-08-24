import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { BookOnBookListWithBook } from "@/app/(app)/usuario/[username]/listas/page";

interface UseFetchBooksOnBookListProps {
    bookListId: string;
    enabled?: boolean;
}

export function useFetchBooksOnBookList({
    bookListId,
    enabled = true,
}: UseFetchBooksOnBookListProps) {
    return useQuery({
        queryKey: ["fetchBooksOnBookList", { bookListId }],
        queryFn: async () => {
            const { data } = await api.get<BookOnBookListWithBook[]>(
                `/books-on-booklists/bookList/${bookListId}`,
            );

            return data;
        },
        enabled,
        staleTime: 1000 * 60 * 60 * 1, // 1 hour
    });
}
