"use client";

import { useContext, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";

import {
    GetIsCurrentUserFollowingTargetUserResponse,
    GetUserFollowingResponse,
    useGetUserFollowing,
} from "@/endpoints/queries/followsQueries";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";
import { LinkUnderline } from "@/components/LinkUnderline";
import { useFollowUser, useUnfollowUser } from "@/endpoints/mutations/followsMutation";
import { useQueryClient } from "@tanstack/react-query";

interface FollowingDialogProps {
    username: string;
    targetUserId: string;
    followingCount: number;
}

export function FollowingDialog({ username, targetUserId, followingCount }: FollowingDialogProps) {
    const { user } = useContext(AuthContext);

    const isCurrentUser = isPageUserSameCurrentUser(username);

    const [isOpen, setIsOpen] = useState(false);

    const queryClient = useQueryClient();
    const {
        data: following,
        isFetching,
        isStale,
        refetch,
    } = useGetUserFollowing({
        userId: targetUserId,
        enabled: !!targetUserId && isOpen,
    });

    const followUser = useFollowUser();
    const unfollowUser = useUnfollowUser();
    const isLoading = followUser.isLoading || unfollowUser.isLoading;

    function handleFollowUser(userIdToFollow: string) {
        if (isLoading || !user || !userIdToFollow) return;

        followUser.mutate(
            {
                followerId: user.id,
                followingId: userIdToFollow,
            },
            {
                onSuccess: () => {
                    // real time update modal user following button "follow/following"
                    // and invalidate both follows modal for next open
                    queryClient.setQueryData<GetUserFollowingResponse[]>(
                        ["getUserFollowing", { userId: targetUserId }],
                        (prevData) => {
                            if (!prevData) return;

                            const updatedFollowers = [...prevData];

                            const itemToUpdate = updatedFollowers.find(
                                (item) => item.followingId === userIdToFollow,
                            );

                            if (itemToUpdate) {
                                itemToUpdate.isFollowedByCurrentUser = true;
                            }

                            return updatedFollowers;
                        },
                    );
                    queryClient.invalidateQueries({
                        queryKey: ["getUserFollowing"],
                        refetchType: "none",
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["getUserFollowers"],
                        refetchType: "none",
                    });

                    queryClient.setQueryData<GetIsCurrentUserFollowingTargetUserResponse>(
                        ["getIsCurrentUserFollowingTargetUser", { targetUserId: userIdToFollow }],
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

    function handleUnfollowUser(userIdToUnfollow: string) {
        if (isLoading || !user || !userIdToUnfollow) return;

        unfollowUser.mutate(
            {
                followerId: user.id,
                followingId: userIdToUnfollow,
            },
            {
                onSuccess: () => {
                    // real time update modal user following button "follow/following"
                    // and invalidate both follows modal for next open
                    queryClient.setQueryData<GetUserFollowingResponse[]>(
                        ["getUserFollowing", { userId: targetUserId }],
                        (prevData) => {
                            if (!prevData) return;

                            const updatedFollowers = [...prevData];

                            const itemToUpdate = updatedFollowers.find(
                                (item) => item.followingId === userIdToUnfollow,
                            );

                            if (itemToUpdate) {
                                itemToUpdate.isFollowedByCurrentUser = false;
                            }

                            return updatedFollowers;
                        },
                    );
                    queryClient.invalidateQueries({
                        queryKey: ["getUserFollowing"],
                        refetchType: "none",
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["getUserFollowers"],
                        refetchType: "none",
                    });

                    queryClient.setQueryData<GetIsCurrentUserFollowingTargetUserResponse>(
                        ["getIsCurrentUserFollowingTargetUser", { targetUserId: userIdToUnfollow }],
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

    async function handleOpenDialog() {
        if (isStale) {
            await refetch();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger onClick={handleOpenDialog}>
                <span className="mr-1 font-medium">{followingCount}</span>
                <span className="text-zinc-500">seguindo</span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Seguindo</DialogTitle>
                </DialogHeader>
                {isFetching ? (
                    <>
                        {Array.from({ length: 2 }, (_, index) => (
                            <div key={index} className="flex animate-pulse items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                                <div className="flex flex-col">
                                    <div className="h-5 w-36 bg-gray-200"></div>
                                    <div className="mt-1 h-4 w-28 bg-gray-200"></div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : !!following?.length ? (
                    following.map((item) => (
                        <div className="flex items-center gap-4 text-sm">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={item.following.imageUrl} />
                                <AvatarFallback>
                                    {item.following.username[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col items-start">
                                <LinkUnderline
                                    href={`/@${item.following.username}`}
                                    className="max-w-[10rem] truncate font-semibold sm:max-w-[18rem]"
                                >
                                    @{item.following.username}
                                </LinkUnderline>
                                <span className="max-w-[10rem] truncate text-muted-foreground sm:max-w-[18rem]">
                                    {item.following.name}
                                </span>
                            </div>

                            {item.followingId !== user?.id && (
                                <div className="ml-auto">
                                    <Button
                                        size="sm"
                                        variant="black"
                                        onClick={
                                            item.isFollowedByCurrentUser
                                                ? () => handleUnfollowUser(item.followingId)
                                                : () => handleFollowUser(item.followingId)
                                        }
                                        disabled={isLoading}
                                    >
                                        {item.isFollowedByCurrentUser ? "Seguindo" : "Seguir"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex h-36 flex-col items-center justify-center text-center">
                        <h2 className="text-base font-semibold">
                            {isCurrentUser ? "Você" : `${username}`} não está seguindo ninguém.
                        </h2>
                        <p className="mt-2 w-[26rem] text-sm leading-6 text-slate-600">
                            {isCurrentUser
                                ? "Que tal seguir seus amigos e acompanhar suas leituras?"
                                : `Atualmente ${username} prefere não acompanhar a leitura  dos outros usuários.`}
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
