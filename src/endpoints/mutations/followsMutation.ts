import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { GetUserFollowersResponse, GetUsersFollowsCountResponse } from "../queries/followsQueries";

import { useToast } from "@/components/ui/UseToast";

interface UseFollowUserProps {
    followerId: string;
    followingId: string;
}

export function useFollowUser() {
    const queryClient = useQueryClient();

    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ followerId, followingId }: UseFollowUserProps) => {
            await api.post("/user-followers", {
                followerId,
                followingId,
            });
        },
        onSuccess: (_, { followerId, followingId }) => {
            // update target user follower count
            queryClient.setQueryData<GetUsersFollowsCountResponse>(
                ["getUsersFollowsCount", { userId: followerId }],
                (prevData) => {
                    if (!prevData) return;

                    const updatedUserFollows = { ...prevData };

                    if (typeof updatedUserFollows.following === "number") {
                        updatedUserFollows.following++;
                    }

                    return {
                        followers: updatedUserFollows.followers ?? 0,
                        following: updatedUserFollows.following ?? 0,
                    };
                },
            );

            // update current user following count
            queryClient.setQueryData<GetUsersFollowsCountResponse>(
                ["getUsersFollowsCount", { userId: followingId }],
                (prevData) => {
                    if (!prevData) return;

                    const updatedUserFollows = { ...prevData };

                    if (typeof updatedUserFollows.followers === "number") {
                        updatedUserFollows.followers++;
                    }

                    return {
                        followers: updatedUserFollows.followers ?? 0,
                        following: updatedUserFollows.following ?? 0,
                    };
                },
            );
        },
        onError: () => {
            toast({
                title: "Erro ao seguir usuário.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on follow user.");
        },
    });
}

interface UseUnfollowUserProps {
    followerId: string;
    followingId: string;
}

export function useUnfollowUser() {
    const queryClient = useQueryClient();

    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ followerId, followingId }: UseUnfollowUserProps) => {
            await api.delete(`/user-followers/${followerId}/${followingId}`);
        },
        onSuccess: (_, { followerId, followingId }) => {
            // update target user following count
            queryClient.setQueryData<GetUsersFollowsCountResponse>(
                ["getUsersFollowsCount", { userId: followerId }],
                (prevData) => {
                    if (!prevData) return;

                    const updatedUserFollows = { ...prevData };

                    if (typeof updatedUserFollows.following === "number") {
                        updatedUserFollows.following--;
                    }

                    return {
                        followers: updatedUserFollows.followers ?? 0,
                        following: updatedUserFollows.following ?? 0,
                    };
                },
            );

            // update current user followers count
            queryClient.setQueryData<GetUsersFollowsCountResponse>(
                ["getUsersFollowsCount", { userId: followingId }],
                (prevData) => {
                    if (!prevData) return;

                    const updatedUserFollows = { ...prevData };

                    if (typeof updatedUserFollows.followers === "number") {
                        updatedUserFollows.followers--;
                    }

                    return {
                        followers: updatedUserFollows.followers ?? 0,
                        following: updatedUserFollows.following ?? 0,
                    };
                },
            );

            // update modal user followers button "follow/following"
            queryClient.setQueryData<GetUserFollowersResponse[]>(
                ["getUserFollowers", { userId: followerId }],
                (prevData) => {
                    if (!prevData) return;

                    const updatedFollowers = [...prevData];

                    const itemToUpdate = updatedFollowers.find(
                        (item) => item.followerId === followingId,
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
                ["getUserFollowing", { userId: followerId }],
                (prevData) => {
                    if (!prevData) return;

                    const updatedFollowers = [...prevData];

                    const itemToUpdate = updatedFollowers.find(
                        (item) => item.followingId === followingId,
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
            toast({
                title: "Erro ao desseguir usuário.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on unfollow user.");
        },
    });
}
