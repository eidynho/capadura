"use client";

import { useEffect, useState } from "react";
import { Link as LinkIcon, MapPin, Twitter } from "lucide-react";

import { api } from "@/lib/api";
import { ProgressData, ReadData } from "../../livros/[id]/page";
import { ProfileData } from "@/contexts/AuthContext";

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
    const [isMounted, setIsMounted] = useState(false);
    const [userData, setUserData] = useState<UserData>({
        user: {
            id: "",
            name: "",
            username: "",
            email: "",
            createdAt: undefined,
            imageKey: null,
            imageUrl: undefined,
            description: null,
            location: null,
            website: null,
            twitter: null,
        },
        reads: {
            items: [],
            total: 0,
        },
        progress: {
            items: [],
            total: 0,
        },
        followersCount: 0,
        followingCount: 0,
    });
    const [date, setDate] = useState<Date | undefined>(new Date());

    useEffect(() => {
        async function fetchUserData() {
            try {
                setIsMounted(false);
                const user = await api.get(`/users/${params.username}`);
                const userId = user.data.id;

                const readsPromise = api.get(
                    `/user-reads?userId=${userId}&status=FINISHED&page=1&perPage=3`,
                );
                const progressPromise = api.get(`/user-progress/${userId}?page=1&perPage=3`);

                const countUserFollowsPromise = api.get(`/count-user-follows/${userId}`);

                const [reads, progress, countUserFollows] = await Promise.all([
                    readsPromise,
                    progressPromise,
                    countUserFollowsPromise,
                ]);

                setUserData({
                    user: user.data,
                    reads: reads.data,
                    progress: progress.data,
                    followersCount: countUserFollows.data.followers,
                    followingCount: countUserFollows.data.following,
                });
            } catch (err) {
                throw new Error("Failed on fetch user data: " + err);
            } finally {
                setIsMounted(true);
            }
        }
        fetchUserData();
    }, [params.username]);

    function renderHeaderInfo() {
        return (
            <div className="flex w-full flex-col gap-5 md:w-[28rem]">
                <div className="mt-1 flex gap-x-8 gap-y-3">
                    <LinkUnderline href="">
                        <span className="mr-1 font-medium">234</span>
                        <span className="text-zinc-500">livros</span>
                    </LinkUnderline>

                    {!!userData.user.id && (
                        <>
                            <FollowersDialog
                                userId={userData.user.id}
                                followersCount={userData.followersCount}
                            />

                            <FollowingDialog
                                userId={userData.user.id}
                                followingCount={userData.followingCount}
                            />
                        </>
                    )}
                </div>

                {userData.user.description && (
                    <h1 className="text-sm">{userData.user.description}</h1>
                )}

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                    {userData.user.location && (
                        <div className="flex items-center gap-1">
                            <MapPin size={16} />

                            <span>{userData.user.location}</span>
                        </div>
                    )}

                    {userData.user.website && (
                        <div className="flex items-center gap-1">
                            <LinkIcon size={15} />

                            <LinkUnderline asChild className="font-semibold">
                                <a href={userData.user.website} target="_blank">
                                    {userData.user.website}
                                </a>
                            </LinkUnderline>
                        </div>
                    )}

                    {userData.user.twitter && (
                        <div className="flex items-center gap-1">
                            <Twitter size={16} />
                            <LinkUnderline asChild className="font-semibold">
                                <a
                                    href={`https://twitter.com/${userData.user.twitter}`}
                                    target="_blank"
                                >
                                    {userData.user.twitter}
                                </a>
                            </LinkUnderline>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    function updateCountUserFollowers(isFollow: boolean) {
        setUserData((prev) => {
            const updatedUser = { ...prev };

            if (isFollow) {
                updatedUser.followersCount++;
            } else {
                updatedUser.followersCount--;
            }

            return updatedUser;
        });
    }

    // render loading
    if (!isMounted) {
        return <Loading />;
    }

    return (
        <Container>
            <div className="flex flex-col items-start justify-center md:flex-row">
                <div className="flex items-start gap-8">
                    <Avatar className="h-28 w-28 md:h-40 md:w-40">
                        <AvatarImage src={userData.user.imageUrl} />
                        <AvatarFallback>{userData.user.username[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start">
                            <div>
                                <h2 className="text-xl font-bold leading-relaxed tracking-tight">
                                    {userData.user.name}
                                </h2>
                                <span className="font-medium">@{userData.user.username}</span>
                            </div>

                            <EditProfileButton />
                            <FollowUserButton
                                profileId={userData.user.id}
                                updateCountUserFollowers={updateCountUserFollowers}
                            />
                        </div>

                        <div className="hidden md:block">{renderHeaderInfo()}</div>
                    </div>
                </div>

                <div className="block md:hidden">{renderHeaderInfo()}</div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-8 lg:flex-row">
                <div className="flex w-full flex-col gap-12 lg:w-3/5">
                    <FavoriteBooks />

                    <FinishedReads readsData={userData.reads} />

                    <RecentProgress progressData={userData.progress} />
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
                        {userData.user?.id && <RatingChart userId={userData.user.id as string} />}
                    </div>

                    <div className="w-full sm:w-1/2 lg:w-full">
                        <h3 className="font-semibold">Atividades</h3>
                        {userData.user.id && <UserActivities userId={userData.user.id as string} />}
                    </div>
                </div>
            </div>
        </Container>
    );
}
