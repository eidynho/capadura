import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { ReadData } from "./readsQueries";

export interface ProgressData {
    id: string;
    readId: string;
    createdAt: string;
    description: string;
    isSpoiler: boolean;
    pagesRead: number;
    page: number;
    percentage: number;
    read?: ReadData;
}

export interface ProgressDataResponse {
    items: ProgressData[];
    total: number;
}

interface UseFetchUserProgressProps {
    userId: string;
    page?: number;
    perPage?: number;
    enabled?: boolean;
}

export function useFetchUserProgress({
    userId,
    page = 1,
    perPage = 3,
    enabled = true,
}: UseFetchUserProgressProps) {
    return useQuery({
        queryKey: ["fetchUserProgress", { userId }],
        queryFn: async () => {
            const { data } = await api.get(
                `/user-progress/${userId}?page=${page}&perPage=${perPage}`,
            );

            return data as ProgressDataResponse;
        },
        enabled,
    });
}

interface UseFetchReadProgressProps {
    readId: string;
    page?: number;
    perPage?: number;
    enabled?: boolean;
}

export function useFetchReadProgress({
    readId,
    page = 1,
    perPage = 30,
    enabled = true,
}: UseFetchReadProgressProps) {
    return useQuery({
        queryKey: ["fetchReadProgress", { readId, page, perPage }],
        queryFn: async () => {
            const { data } = await api.get(
                `/progress/read/${readId}?page=${page}&perPage=${perPage}`,
            );

            return data as ProgressDataResponse;
        },
        enabled,
    });
}

type UserPagesReadedByDay = { createdAt: string; pagesReaded: number }[];

interface UseGetPagesReadedByDayProps {
    userId: string;
    enabled?: boolean;
}

export function useGetPagesReadedByDay({ userId, enabled }: UseGetPagesReadedByDayProps) {
    return useQuery({
        queryKey: ["getPagesReadedByDay", { userId }],
        queryFn: async () => {
            const { data } = await api.get(`/user/${userId}/pages-readed`);

            return data as UserPagesReadedByDay;
        },
        enabled,
    });
}
