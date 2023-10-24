import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export interface FetchUserActivitiesResponse {
    id: string;
    activity?: string;
    activityType:
        | "LIKE_BOOK"
        | "START_READ"
        | "PAUSE_READ"
        | "RESUME_READ"
        | "ADD_BOOK_PROGRESS"
        | "ADD_BOOK_REVIEW";
    createdAt: string;
    book: {
        title: string;
    };
    bookId?: string;
    userId: string;
}

interface UseFetchUserActivitiesProps {
    userId: string;
    enabled?: boolean;
}

export function useFetchUserActivities({ userId, enabled = true }: UseFetchUserActivitiesProps) {
    return useQuery({
        queryKey: ["fetchUserActivities", { userId }],
        queryFn: async () => {
            const { data } = await api.get(`/user-activities/${userId}`);

            return data as FetchUserActivitiesResponse[];
        },
        enabled,
    });
}
