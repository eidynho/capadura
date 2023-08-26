import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export interface GetUsersFollowsCountResponse {
    followers: number;
    following: number;
}

interface UseGetUsersFollowsCountProps {
    userId: string;
    enabled?: boolean;
}

export function useGetUsersFollowsCount({ userId, enabled = true }: UseGetUsersFollowsCountProps) {
    return useQuery({
        queryKey: ["getUsersFollowsCount", { userId }],
        queryFn: async () => {
            const { data } = await api.get<GetUsersFollowsCountResponse>(
                `/count-user-follows/${userId}`,
            );

            return data;
        },
        enabled,
    });
}

export interface GetUserFollowersResponse {
    follower: {
        name: string;
        username: string;
        imageKey?: string;
        imageUrl?: string;
    };
    followerId: string;
    followingId: string;
    isFollowedByCurrentUser?: boolean;
}

interface UseGetUserFollowersProps {
    userId: string;
    enabled?: boolean;
}

export function useGetUserFollowers({ userId, enabled = true }: UseGetUserFollowersProps) {
    return useQuery({
        queryKey: ["getUserFollowers", { userId }],
        queryFn: async () => {
            const { data } = await api.get<GetUserFollowersResponse[]>(`/user-followers/${userId}`);

            return data;
        },
        enabled,
    });
}

export interface GetUserFollowingResponse {
    following: {
        name: string;
        username: string;
        imageKey?: string;
        imageUrl?: string;
    };
    followerId: string;
    followingId: string;
    isFollowedByCurrentUser?: boolean;
}

interface UseGetUserFollowingProps {
    userId: string;
    enabled?: boolean;
}

export function useGetUserFollowing({ userId, enabled = true }: UseGetUserFollowingProps) {
    return useQuery({
        queryKey: ["getUserFollowing", { userId }],
        queryFn: async () => {
            const { data } = await api.get<GetUserFollowingResponse[]>(`/user-following/${userId}`);

            return data;
        },
        enabled,
    });
}

export interface GetIsCurrentUserFollowingTargetUserResponse {
    isFollowing: boolean;
}

interface UseGetIsCurrentUserFollowingTargetUserProps {
    targetUserId: string;
    enabled?: boolean;
}

export function useGetIsCurrentUserFollowingTargetUser({
    targetUserId,
    enabled = true,
}: UseGetIsCurrentUserFollowingTargetUserProps) {
    return useQuery({
        queryKey: ["getIsCurrentUserFollowingTargetUser", { targetUserId }],
        queryFn: async () => {
            const { data } = await api.get<GetIsCurrentUserFollowingTargetUserResponse>(
                `/user-is-following/${targetUserId}`,
            );

            return data;
        },
        enabled,
    });
}
