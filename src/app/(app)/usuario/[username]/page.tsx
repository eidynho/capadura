"use client";

import { useState } from "react";
import { Link as LinkIcon, MapPin, Twitter } from "lucide-react";

import { ProgressData, ReadData } from "../../livros/[id]/page";
import { ProfileData } from "@/contexts/AuthContext";

import { useFetchUserByUsername } from "@/endpoints/queries/usersQueries";
import { useGetUsersFollowsCount } from "@/endpoints/queries/followsQueries";
import { useFetchUserReadsByUser } from "@/endpoints/queries/readsQueries";
import { useFetchUserProgress } from "@/endpoints/queries/progressQueries";

import Loading from "./loading";
import { FavoriteBooks } from "./components/favoriteBooks";

import { Calendar } from "@/components/ui/Calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { LinkUnderline } from "@/components/LinkUnderline";
import { Container } from "@/components/layout/Container";
import { RatingChart } from "@/components/RatingChart";
import { UserActivities } from "./components/userActivities";
import { EditProfileButton } from "./components/editProfileButton";
import { FollowUserButton } from "./components/follows/FollowUserButton";
import { FollowersDialog } from "./components/follows/FollowersDialog";
import { FollowingDialog } from "./components/follows/FollowingDialog";
import { FinishedReads } from "./components/finishedReads";
import { RecentProgress } from "./components/recentProgress";

export interface HandleToggleFollowUserProps {
    userId: string;
    targetUserId: string;
}

export interface UserData {
    user: ProfileData;
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

interface MeProps {
    params: {
        username: string;
    };
}

export default function Me({ params }: MeProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // ----- queries ----- //
    const { data: targetUser, isFetched: isFetchedUser } = useFetchUserByUsername({
        username: params.username,
        enabled: !!params.username,
    });
    const { data: followingCount, isFetched: isFetchedFollowsCount } = useGetUsersFollowsCount({
        userId: targetUser?.id || "",
        enabled: !!targetUser?.id,
    });

    const { data: userReads, isFetched: isFetchedUserReads } = useFetchUserReadsByUser({
        userId: targetUser?.id || "",
        enabled: !!targetUser?.id,
    });

    const { data: userProgress, isFetched: isFetchedUserProgress } = useFetchUserProgress({
        userId: targetUser?.id || "",
        enabled: !!targetUser?.id,
    });

    // render loading
    const isMounting =
        !isFetchedUser || !isFetchedFollowsCount || !isFetchedUserReads || !isFetchedUserProgress;

    if (isMounting) {
        return <Loading />;
    }

    function renderHeaderInfo() {
        return (
            <div className="flex w-full flex-col gap-5 md:w-[28rem]">
                <div className="mt-1 flex gap-x-8 gap-y-3">
                    <LinkUnderline href="">
                        <span className="mr-1 font-medium">234</span>
                        <span className="text-zinc-500">livros</span>
                    </LinkUnderline>

                    {!!targetUser?.id && (
                        <>
                            <FollowersDialog
                                targetUserId={targetUser.id}
                                followersCount={followingCount?.followers || 0}
                            />

                            <FollowingDialog
                                targetUserId={targetUser.id}
                                followingCount={followingCount?.following || 0}
                            />
                        </>
                    )}
                </div>

                {targetUser?.description && <h1 className="text-sm">{targetUser?.description}</h1>}

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                    {targetUser?.location && (
                        <div className="flex items-center gap-1">
                            <MapPin size={16} />

                            <span>{targetUser.location}</span>
                        </div>
                    )}

                    {targetUser?.website && (
                        <div className="flex items-center gap-1">
                            <LinkIcon size={15} />

                            <LinkUnderline asChild className="font-semibold">
                                <a href={targetUser.website} target="_blank">
                                    {targetUser.website}
                                </a>
                            </LinkUnderline>
                        </div>
                    )}

                    {targetUser?.twitter && (
                        <div className="flex items-center gap-1">
                            <Twitter size={16} />
                            <LinkUnderline asChild className="font-semibold">
                                <a
                                    href={`https://twitter.com/${targetUser?.twitter}`}
                                    target="_blank"
                                >
                                    {targetUser.twitter}
                                </a>
                            </LinkUnderline>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <Container>
            <div className="flex flex-col items-start justify-center md:flex-row">
                <div className="flex items-start gap-8">
                    <Avatar className="h-28 w-28 md:h-40 md:w-40">
                        <AvatarImage src={targetUser?.imageUrl} />
                        <AvatarFallback>{targetUser?.username[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start">
                            <div>
                                <h2 className="text-xl font-bold leading-relaxed tracking-tight">
                                    {targetUser?.name}
                                </h2>
                                <span className="font-medium">@{targetUser?.username}</span>
                            </div>

                            <EditProfileButton />
                            {!!targetUser?.id && <FollowUserButton targetUserId={targetUser.id} />}
                        </div>

                        <div className="hidden md:block">{renderHeaderInfo()}</div>
                    </div>
                </div>

                <div className="block md:hidden">{renderHeaderInfo()}</div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-8 lg:flex-row">
                <div className="flex w-full flex-col gap-12 lg:w-3/5">
                    <FavoriteBooks />

                    {!!userReads && <FinishedReads readsData={userReads} />}

                    {!!userProgress && <RecentProgress progressData={userProgress} />}
                </div>

                <div className="flex w-full flex-col gap-8 sm:flex-row lg:w-72 lg:flex-col">
                    <div className="w-full sm:w-1/2 lg:w-full">
                        <h3 className="font-semibold">Calendário</h3>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="mt-2 rounded-md border"
                        />
                    </div>

                    <div className="w-full sm:w-1/2 lg:w-full">
                        <h3 className="font-semibold">Avaliações</h3>
                        {targetUser?.id && <RatingChart userId={targetUser.id} />}
                    </div>

                    <div className="w-full sm:w-1/2 lg:w-full">
                        <h3 className="font-semibold">Atividades</h3>
                        {targetUser?.id && <UserActivities userId={targetUser.id} />}
                    </div>
                </div>
            </div>
        </Container>
    );
}
