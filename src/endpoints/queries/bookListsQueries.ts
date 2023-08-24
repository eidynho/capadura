import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { BookListData } from "@/app/(app)/usuario/[username]/listas/page";

interface UseFetchUserBookListsProps {
    userId: string;
    enabled?: boolean;
}

export function useFetchUserBookLists({ userId, enabled = true }: UseFetchUserBookListsProps) {
    return useQuery({
        queryKey: ["fetchUserBookLists", { userId }],
        queryFn: async () => {
            const { data } = await api.get<BookListData[]>(`/booklists/user/${userId}`);

            return data;
        },
        enabled,
        staleTime: 1000 * 60 * 60 * 1, // 1 hour
    });
}

interface UseFetchUserBookListsIncludeBookProps {
    userId: string;
    bookId: string;
    enabled?: boolean;
}

export function useFetchUserBookListsIncludeBook({
    userId,
    bookId,
    enabled = true,
}: UseFetchUserBookListsIncludeBookProps) {
    return useQuery({
        queryKey: ["fetchUserBookListsIncludeBook", { userId, bookId }],
        queryFn: async () => {
            const searchParams = bookId ? `?bookId=${bookId}` : "";

            const { data } = await api.get<BookListData[]>(
                `/booklists/user/${userId}${searchParams}`,
            );

            return data;
        },
        enabled,
        staleTime: 1000 * 60 * 60 * 1, // 1 hour
    });
}
