import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { BookListData } from "@/app/(app)/usuario/[username]/listas/page";

interface UseFetchBookListsProps {
    userId: string;
    bookId: string;
    enabled?: boolean;
}

export function useFetchBookLists({ userId, bookId, enabled = true }: UseFetchBookListsProps) {
    return useQuery({
        queryKey: ["fetchBookLists", { userId, bookId }],
        queryFn: async () => {
            const { data } = await api.get<BookListData[]>(
                `/booklists/user/${userId}?bookId=${bookId}`,
            );

            return data as BookListData[];
        },
        enabled,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}
