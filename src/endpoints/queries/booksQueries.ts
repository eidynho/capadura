import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { BookData } from "@/app/(app)/livros/[id]/page";

interface UseFetchBookProps {
    bookId: string;
    enabled?: boolean;
}

export function useFetchBook({ bookId, enabled = true }: UseFetchBookProps) {
    return useQuery({
        queryKey: ["fetchBook", { bookId }],
        queryFn: async () => {
            const { data } = await api.get(`/book/${bookId}`);

            return data as BookData;
        },
        enabled,
        staleTime: Infinity,
    });
}
