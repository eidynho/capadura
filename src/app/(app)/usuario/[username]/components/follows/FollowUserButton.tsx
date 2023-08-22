"use client";

import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { api } from "@/lib/api";
import { AuthContext } from "@/contexts/AuthContext";
import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";

import { Button } from "@/components/ui/Button";

interface FollowUserButtonProps {
    profileId: string;
    updateCountUserFollowers: (isFollow: boolean) => void;
}

export function FollowUserButton({ profileId, updateCountUserFollowers }: FollowUserButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const { user } = useContext(AuthContext);

    const routePathname = usePathname();
    const username = routePathname.split("/")[2];

    const isCurrentUser = isPageUserSameCurrentUser(username);

    useEffect(() => {
        if (isCurrentUser) return;

        const getIsCurrentUserFollowingAnUniqueUser = async () => {
            try {
                setIsLoading(true);

                const { data } = await api.get(`/user-is-following/${profileId}`);
                setIsFollowing(data.isFollowing);
            } catch (err) {
                throw new Error(
                    "Failed on get if is current user following an unique user: " + err,
                );
            } finally {
                setIsLoading(false);
            }
        };

        getIsCurrentUserFollowingAnUniqueUser();
    }, []);

    async function handleFollowUser() {
        if (isLoading || !user || isCurrentUser) return;

        try {
            setIsLoading(true);

            api.post("/user-followers", {
                followerId: user.id,
                followingId: profileId,
            });

            updateCountUserFollowers(true);

            setIsFollowing(true);
        } catch (err) {
            throw new Error("Failed on toggle user follow: " + err);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleUnfollowUser() {
        if (isLoading || !user || isCurrentUser) return;

        try {
            setIsLoading(true);

            await api.delete(`/user-followers/${user.id}/${profileId}`);

            updateCountUserFollowers(false);

            setIsFollowing(false);
        } catch (err) {
            throw new Error("Failed on toggle user follow: " + err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {!isCurrentUser && (
                <Button
                    size="sm"
                    variant="black"
                    onClick={isFollowing ? handleUnfollowUser : handleFollowUser}
                >
                    {isFollowing ? "Seguindo" : "Seguir"}
                </Button>
            )}
        </>
    );
}
