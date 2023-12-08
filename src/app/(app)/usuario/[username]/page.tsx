"use client";

import { useEffect } from "react";
import { notFound } from "next/navigation";

import { ProfileDataResponse } from "@/endpoints/queries/usersQueries";

import { useWindowSize } from "@/hooks/useWindowSize";

import { useFetchUserByUsername } from "@/endpoints/queries/usersQueries";
import { ReadData } from "@/endpoints/queries/readsQueries";
import { ProgressData } from "@/endpoints/queries/progressQueries";

import Loading from "./loading";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { EditProfileButton } from "./_components/EditProfileButton";
import { FavoriteBooks } from "./_components/favoriteBooks";
import { FinishedReads } from "./_components/FinishedReads";
import { FollowUserButton } from "./_components/follows/FollowUserButton";
import { RatingChart } from "@/components/RatingChart";
import { RecentProgress } from "./_components/RecentProgress";
import { UserActivities } from "./_components/UserActivities";
import { ProfileHeader } from "./_components/ProfileHeader";

export interface HandleToggleFollowUserProps {
    userId: string;
    targetUserId: string;
}

export interface UserData {
    user: ProfileDataResponse;
    reads: {
        items: ReadData[];
        total: number;
    };
    progress: {
        items: ProgressData[];
        total: number;
    };
    followersCount: number;
    followingCount: number;
}

interface UserProps {
    params: {
        username: string;
    };
}

export default function User({ params }: UserProps) {
    const { username } = params;

    const { width } = useWindowSize();

    const {
        data: targetUser,
        isFetched: isFetchedUser,
        isError: isErrorFetchUser,
    } = useFetchUserByUsername({
        username: username,
    });

    useEffect(() => {
        if ((isFetchedUser && !targetUser) || isErrorFetchUser) {
            notFound();
        }
    }, [isFetchedUser, targetUser, isErrorFetchUser]);

    if (!isFetchedUser) {
        return <Loading />;
    }

    return (
        <>
            <div className="flex flex-col items-start justify-center md:flex-row">
                <div className="flex items-start gap-8">
                    <Avatar className="h-28 w-28 md:h-40 md:w-40">
                        <AvatarImage
                            src={targetUser?.imageUrl}
                            width={160}
                            height={160}
                            loading="eager"
                            alt={`Foto de perfil de ${targetUser?.username}`}
                            title={`Foto de perfil de ${targetUser?.username}`}
                        />
                        <AvatarFallback className="text-2xl">
                            {targetUser?.username[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start">
                            <div>
                                <h1 className="block text-xl font-bold leading-relaxed tracking-tight text-black dark:text-white">
                                    {targetUser?.name}
                                </h1>
                                <span className="font-medium text-black dark:text-white">
                                    @{targetUser?.username}
                                </span>
                            </div>

                            <EditProfileButton username={username} />
                            {!!targetUser?.id && (
                                <FollowUserButton
                                    username={username}
                                    targetUserId={targetUser.id}
                                />
                            )}
                        </div>

                        {!!targetUser && !!width && width >= 768 && (
                            <ProfileHeader username={username} targetUser={targetUser} />
                        )}
                    </div>
                </div>

                {!!targetUser && !!width && width < 768 && (
                    <ProfileHeader username={username} targetUser={targetUser} />
                )}
            </div>

            <div className="mt-8 flex flex-col justify-center gap-8 lg:flex-row">
                <div className="flex w-full flex-col gap-12 lg:w-3/5">
                    <FavoriteBooks username={username} />

                    {!!targetUser && <FinishedReads username={username} targetUser={targetUser} />}

                    {!!targetUser && <RecentProgress username={username} targetUser={targetUser} />}
                </div>

                <div className="w-full lg:w-72">
                    <div className="flex w-full flex-col gap-8 sm:flex-row lg:flex-col">
                        <div className="w-full sm:w-1/2 lg:w-full">
                            <h2 className="font-semibold text-black dark:text-white">Avaliações</h2>
                            {targetUser?.id && (
                                <RatingChart userId={targetUser.id} username={username} />
                            )}
                        </div>
                    </div>

                    <div className="mt-8 w-full">
                        <h2 className="font-semibold text-black dark:text-white">Atividades</h2>
                        {targetUser?.id && <UserActivities userId={targetUser.id} />}
                    </div>
                </div>
            </div>
        </>
    );
}
