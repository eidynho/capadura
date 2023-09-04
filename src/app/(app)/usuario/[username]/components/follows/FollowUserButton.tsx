"use client";

import { useContext } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";

import {
    GetIsCurrentUserFollowingTargetUserResponse,
    useGetIsCurrentUserFollowingTargetUser,
} from "@/endpoints/queries/followsQueries";

import { Button } from "@/components/ui/Button";
import { useFollowUser, useUnfollowUser } from "@/endpoints/mutations/followsMutation";
import { useQueryClient } from "@tanstack/react-query";

interface FollowUserButtonProps {
    username: string;
    targetUserId: string;
}

export function FollowUserButton({ username, targetUserId }: FollowUserButtonProps) {
    const { user, isAuthenticated } = useContext(AuthContext);

    const isCurrentUser = isPageUserSameCurrentUser(username);

    const { data } = useGetIsCurrentUserFollowingTargetUser({
        targetUserId,
        enabled: isAuthenticated && !!targetUserId,
    });

    const queryClient = useQueryClient();
    const followUser = useFollowUser();
    const unfollowUser = useUnfollowUser();
    const isLoading = followUser.isLoading || unfollowUser.isLoading;

    function handleFollowUser() {
        if (isLoading || !user || isCurrentUser) return;

        followUser.mutate(
            {
                followerId: user.id,
                followingId: targetUserId,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["getUserFollowers", { userId: targetUserId }],
                        refetchType: "none",
                    });
                    queryClient.setQueryData<GetIsCurrentUserFollowingTargetUserResponse>(
                        ["getIsCurrentUserFollowingTargetUser", { targetUserId }],
                        () => {
                            return {
                                isFollowing: true,
                            };
                        },
                    );
                },
            },
        );
    }

    function handleUnfollowUser() {
        if (isLoading || !user || isCurrentUser) return;

        unfollowUser.mutate(
            {
                followerId: user.id,
                followingId: targetUserId,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["getUserFollowers", { userId: targetUserId }],
                        refetchType: "none",
                    });
                    queryClient.setQueryData<GetIsCurrentUserFollowingTargetUserResponse>(
                        ["getIsCurrentUserFollowingTargetUser", { targetUserId }],
                        () => {
                            return {
                                isFollowing: false,
                            };
                        },
                    );
                },
            },
        );
    }

    return (
        <>
            {isAuthenticated && !isCurrentUser && (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={data?.isFollowing ? handleUnfollowUser : handleFollowUser}
                    disabled={isLoading}
                >
                    {data?.isFollowing ? "Seguindo" : "Seguir"}
                </Button>
            )}
        </>
    );
}
