"use client";

import { useContext } from "react";
import { usePathname } from "next/navigation";

import { AuthContext } from "@/contexts/AuthContext";
import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";
import { HandleToggleFollowUserProps } from "../../page";

import { useGetIsTargetUserFollowingCurrentUser } from "@/endpoints/queries/followsQueries";

import { Button } from "@/components/ui/Button";

interface FollowUserButtonProps {
    targetUserId: string;
    isFollowLoading: boolean;
    followUser: ({ userId, targetUserId }: HandleToggleFollowUserProps) => void;
    unfollowUser: ({ userId, targetUserId }: HandleToggleFollowUserProps) => void;
}

export function FollowUserButton({
    targetUserId,
    isFollowLoading,
    followUser,
    unfollowUser,
}: FollowUserButtonProps) {
    const { user } = useContext(AuthContext);

    const routePathname = usePathname();
    const username = routePathname.split("/")[2];

    const isCurrentUser = isPageUserSameCurrentUser(username);

    const { data: isFollowing } = useGetIsTargetUserFollowingCurrentUser({
        targetUserId,
        enabled: !!targetUserId,
    });

    function handleFollowUser() {
        if (isFollowLoading || !user || isCurrentUser) return;

        followUser({
            userId: user.id,
            targetUserId: targetUserId,
        });
    }

    function handleUnfollowUser() {
        if (isFollowLoading || !user || isCurrentUser) return;

        unfollowUser({
            userId: user.id,
            targetUserId: targetUserId,
        });
    }

    return (
        <>
            {!isCurrentUser && (
                <Button
                    size="sm"
                    variant="black"
                    onClick={isFollowing ? handleUnfollowUser : handleFollowUser}
                    disabled={isFollowLoading}
                >
                    {isFollowing ? "Seguindo" : "Seguir"}
                </Button>
            )}
        </>
    );
}
