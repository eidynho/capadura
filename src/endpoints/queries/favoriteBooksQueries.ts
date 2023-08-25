import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { BookData } from "@/app/(app)/livros/[id]/page";

export interface FavoriteBooksData {
    id: string;
    order: number;
    bookId: string;
    book: BookData;
    updatedAt: Date | string;
    userId: string;
}

interface UseFetchUserFavoriteBooksProps {
    username: string;
    enabled?: boolean;
}

export function useFetchUserFavoriteBooks({
    username,
    enabled = true,
}: UseFetchUserFavoriteBooksProps) {
    return useQuery({
        queryKey: ["fetchUserFavoriteBooks", { username }],
        queryFn: async () => {
            const { data } = await api.get<(FavoriteBooksData | null)[]>(
                `/favorite-books/user/${username}`,
            );

            let returnData: (FavoriteBooksData | null)[] = [null, null, null, null];

            returnData = returnData.map((_, index) => {
                const order = index + 1;
                const matchingBook = data.find((item) => item?.order === order);

                return matchingBook || null;
            });

            return returnData;
        },
        enabled,
    });
}
