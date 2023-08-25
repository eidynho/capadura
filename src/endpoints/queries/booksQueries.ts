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
            const { data } = await api.get<BookData>(`/book/${bookId}`);

            return data;
        },
        enabled,
        staleTime: Infinity,
    });
}
