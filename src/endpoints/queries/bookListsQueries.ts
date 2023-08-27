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
            const { data } = await api.get(`/booklists/user/${userId}`);

            return data as BookListData[];
        },
        enabled,
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

            const { data } = await api.get(`/booklists/user/${userId}${searchParams}`);

            return data as BookListData[];
        },
        enabled,
    });
}
