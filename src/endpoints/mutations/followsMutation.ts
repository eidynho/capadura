import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { api } from "@/lib/api";
import { GetUserFollowersResponse, GetUsersFollowsCountResponse } from "../queries/followsQueries";

interface UseFollowUserProps {
    userId: string;
    targetUserId: string;
}

export function useFollowUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, targetUserId }: UseFollowUserProps) => {
            await api.post("/user-followers", {
                followerId: userId,
                followingId: targetUserId,
            });
        },
        onSuccess: (_, { userId, targetUserId }) => {
            // update current user follows count
            queryClient.setQueryData<GetUsersFollowsCountResponse>(
                ["getUsersFollowsCount", { userId }],
                (prevData) => {
                    const updatedUserFollows = { ...prevData };

                    if (typeof updatedUserFollows.following === "number") {
                        updatedUserFollows.following++;
                    }

                    return {
                        followers: updatedUserFollows.followers || 0,
                        following: updatedUserFollows.following || 0,
                    };
                },
            );

            // update modal user followers button "follow/following"
            queryClient.setQueryData<GetUserFollowersResponse[]>(
                ["getUserFollowers", { userId }],
                (prevData) => {
                    const updatedFollowers = [...(prevData || [])];

                    const itemToUpdate = updatedFollowers.find(
                        (item) => item.followerId === targetUserId,
                    );

                    if (!itemToUpdate) {
                        return updatedFollowers;
                    }

                    itemToUpdate.isFollowedByCurrentUser = true;

                    return updatedFollowers;
                },
            );

            // update modal user following button "follow/following"
            queryClient.setQueryData<GetUserFollowersResponse[]>(
                ["getUserFollowing", { userId }],
                (prevData) => {
                    const updatedFollowers = [...(prevData || [])];

                    const itemToUpdate = updatedFollowers.find(
                        (item) => item.followingId === targetUserId,
                    );

                    if (!itemToUpdate) {
                        return updatedFollowers;
                    }

                    itemToUpdate.isFollowedByCurrentUser = true;

                    return updatedFollowers;
                },
            );
        },
        onError: () => {
            toast.error("Erro ao seguir usuário.");
            throw new Error("Failed on follow user.");
        },
    });
}

interface UseUnfollowUserProps {
    userId: string;
    targetUserId: string;
}

export function useUnfollowUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, targetUserId }: UseUnfollowUserProps) => {
            await api.delete(`/user-followers/${userId}/${targetUserId}`);
        },
        onSuccess: (_, { userId, targetUserId }) => {
            queryClient.setQueryData<GetUsersFollowsCountResponse>(
                ["getUsersFollowsCount", { userId }],
                (prevData) => {
                    const updatedUserFollows = { ...prevData };

                    if (typeof updatedUserFollows.following === "number") {
                        updatedUserFollows.following--;
                    }

                    return {
                        followers: updatedUserFollows.followers || 0,
                        following: updatedUserFollows.following || 0,
                    };
                },
            );

            // update modal user followers button "follow/following"
            queryClient.setQueryData<GetUserFollowersResponse[]>(
                ["getUserFollowers", { userId }],
                (prevData) => {
                    const updatedFollowers = [...(prevData || [])];

                    const itemToUpdate = updatedFollowers.find(
                        (item) => item.followerId === targetUserId,
                    );

                    if (!itemToUpdate) {
                        return updatedFollowers;
                    }

                    itemToUpdate.isFollowedByCurrentUser = false;

                    return updatedFollowers;
                },
            );

            // update modal user following button "follow/following"
            queryClient.setQueryData<GetUserFollowersResponse[]>(
                ["getUserFollowing", { userId }],
                (prevData) => {
                    const updatedFollowers = [...(prevData || [])];

                    const itemToUpdate = updatedFollowers.find(
                        (item) => item.followingId === targetUserId,
                    );

                    if (!itemToUpdate) {
                        return updatedFollowers;
                    }

                    itemToUpdate.isFollowedByCurrentUser = false;

                    return updatedFollowers;
                },
            );
        },
        onError: () => {
            toast.error("Erro ao desseguir usuário.");
            throw new Error("Failed on unfollow user.");
        },
    });
}
