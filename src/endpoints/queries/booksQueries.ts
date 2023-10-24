import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export interface BookData {
    id: string;
    title: string;
    subtitle?: string | null;
    authors: string[];
    publisher?: string | null;
    publishDate?: string | null;
    language?: string | null;
    pageCount?: number | null;
    description?: string | null;
    imageKey?: string | null;
    imageUrl?: string;
    isbn13?: string;
}

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
