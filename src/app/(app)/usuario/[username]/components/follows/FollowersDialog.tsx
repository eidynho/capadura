"use client";

import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { api } from "@/lib/api";
import { AuthContext } from "@/contexts/AuthContext";
import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";

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

interface FollowerData {
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

interface FollowersDialogProps {
    userId: string;
    followersCount: number;
}

export function FollowersDialog({ userId, followersCount }: FollowersDialogProps) {
    const { user } = useContext(AuthContext);
    const routePathname = usePathname();
    const username = routePathname.split("/")[2];

    const isCurrentUser = isPageUserSameCurrentUser(username);

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [followers, setFollowers] = useState<FollowerData[]>([]);

    useEffect(() => {
        if (!isOpen) return;

        const fetchFollowers = async () => {
            try {
                setIsFetching(true);

                const { data } = await api.get(
                    `/user-followers/${userId}${user ? `/${user.id}` : ""}`,
                );
                setFollowers(data);
            } catch (err) {
                throw new Error("Failed on get user followers: " + err);
            } finally {
                setIsFetching(false);
            }
        };

        fetchFollowers();
    }, [isOpen]);

    function updateIsFollowedByCurrentUser(userIdToFollow: string, isFollow: boolean) {
        setFollowers((prev) => {
            const updatedFollowers = [...prev];

            const itemToUpdate = updatedFollowers.find(
                (item) => item.followerId === userIdToFollow,
            );

            if (!itemToUpdate) {
                return updatedFollowers;
            }

            itemToUpdate.isFollowedByCurrentUser = isFollow;

            return updatedFollowers;
        });
    }

    async function handleFollowUser(followingId: string) {
        if (isLoading || !user || !followingId) return;

        try {
            setIsLoading(true);

            api.post("/user-followers", {
                followerId: user.id,
                followingId: followingId,
            });

            updateIsFollowedByCurrentUser(followingId, true);
        } catch (err) {
            throw new Error("Failed on follow user: " + err);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleUnfollowUser(followingId: string) {
        if (isLoading || !user || !followingId) return;

        try {
            setIsLoading(true);

            await api.delete(`/user-followers/${user.id}/${followingId}`);

            updateIsFollowedByCurrentUser(followingId, false);
        } catch (err) {
            throw new Error("Failed on unfollow user: " + err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <span className="mr-1 font-medium">{followersCount}</span>
                <span className="text-zinc-500">seguidores</span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Seguidores</DialogTitle>
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
                ) : !!followers.length ? (
                    followers.map((item) => (
                        <div className="flex items-center gap-4 text-sm">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={item.follower.imageUrl} />
                                <AvatarFallback>
                                    {item.follower.username[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col items-start">
                                <LinkUnderline
                                    href={`/usuario/${item.follower.username}`}
                                    className="max-w-[10rem] truncate font-semibold sm:max-w-[18rem]"
                                >
                                    @{item.follower.username}
                                </LinkUnderline>
                                <span className="max-w-[10rem] truncate text-muted-foreground sm:max-w-[18rem]">
                                    {item.follower.name}
                                </span>
                            </div>

                            {item.followerId !== user?.id && (
                                <div className="ml-auto">
                                    <Button
                                        size="sm"
                                        variant="black"
                                        onClick={
                                            item.isFollowedByCurrentUser
                                                ? () => handleUnfollowUser(item.followerId)
                                                : () => handleFollowUser(item.followerId)
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
                        <h2 className="text-base font-semibold">Nenhum seguidor encontrado.</h2>
                        <p className="mt-2 w-[26rem] text-sm leading-6 text-slate-600">
                            {isCurrentUser
                                ? "Que tal convidar seus amigos para te seguir e compartilhar leituras?"
                                : `Que tal seguir ${username} para acompanhar suas leituras?`}
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
