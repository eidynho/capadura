"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { Link as LinkIcon, MapPin, Twitter } from "lucide-react";

import { api } from "@/lib/api";
import { ProgressData, ReadData } from "../../livros/[id]/page";
import { ProfileData } from "@/contexts/AuthContext";

import Loading from "./loading";
import { FavoriteBooks } from "./components/favoriteBooks";

import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { LinkUnderline } from "@/components/LinkUnderline";
import { RatingStars } from "@/components/RatingStars";
import { Container } from "@/components/layout/Container";
import { RatingChart } from "@/components/RatingChart";
import { UserActivities } from "./components/userActivities";

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
    });
    const [date, setDate] = useState<Date | undefined>(new Date());

    useEffect(() => {
        async function fetchUserData() {
            try {
                setIsMounted(false);
                const userResponse = await api.get(`/users/${params.username}`);
                const userId = userResponse.data.id;

                const readsPromise = api.get(
                    `/user-reads?userId=${userId}&status=FINISHED&page=1&perPage=3`,
                );
                const progressPromise = api.get(`/user-progress/${userId}?page=1&perPage=3`);

                const [readsResponse, progressResponse] = await Promise.all([
                    readsPromise,
                    progressPromise,
                ]);

                setUserData({
                    user: userResponse.data,
                    reads: readsResponse.data,
                    progress: progressResponse.data,
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

                    <LinkUnderline href="">
                        <span className="mr-1 font-medium">234</span>
                        <span className="text-zinc-500">seguidores</span>
                    </LinkUnderline>

                    <LinkUnderline href="">
                        <span className="mr-1 font-medium">5535</span>
                        <span className="text-zinc-500">seguindo</span>
                    </LinkUnderline>
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
                        <AvatarFallback>
                            {userData.user.username[0]?.toUpperCase() || ""}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start">
                            <div>
                                <h2 className="text-xl font-bold leading-relaxed tracking-tight">
                                    {userData.user.name}
                                </h2>
                                <span className="font-medium">@{userData.user.username}</span>
                            </div>
                            <Button asChild size="sm" variant="black">
                                <Link href={`/usuario/${userData.user?.username}/config`}>
                                    Editar perfil
                                </Link>
                            </Button>
                        </div>

                        <div className="hidden md:block">{renderHeaderInfo()}</div>
                    </div>
                </div>

                <div className="block md:hidden">{renderHeaderInfo()}</div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-8 lg:flex-row">
                <div className="flex w-full flex-col gap-12 lg:w-3/5">
                    <FavoriteBooks />

                    <div className="flex flex-col">
                        <h3 className="font-semibold">Leituras finalizadas</h3>

                        {userData.reads?.items?.length &&
                            userData.reads.items.map((read) => (
                                <div className="flex gap-4 border-t border-black/20 py-4 last:border-b">
                                    <div className="h-28 w-20 rounded-md border border-black"></div>
                                    <div className="w-full">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <LinkUnderline
                                                    href={`/livros/${read.bookId}`}
                                                    className="font-semibold"
                                                >
                                                    {read.book?.title}
                                                </LinkUnderline>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            {!!read.reviewRating && (
                                                <RatingStars rating={read.reviewRating} />
                                            )}

                                            {read.endDate && (
                                                <div className="ml-3 flex items-center gap-1">
                                                    <span className="text-sm font-medium">
                                                        Finalizado em
                                                    </span>
                                                    <span className="mt-[2px] text-xs font-semibold text-gray-500">
                                                        {format(
                                                            parseISO(read?.endDate.toString()),
                                                            "dd/MM/yyyy",
                                                            { locale: pt },
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {read?.reviewContent && (
                                            <p className="mt-2 text-justify text-sm">
                                                {read?.reviewContent}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="flex flex-col">
                        <h3 className="font-semibold">Progressos recentes</h3>

                        {userData.progress?.items?.length &&
                            userData.progress.items.map((progress) => (
                                <div className="flex gap-4 border-t border-black/20 py-4 last:border-b">
                                    <div className="h-28 w-20 rounded-md border border-black"></div>
                                    <div className="w-full">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <LinkUnderline
                                                    href={`/livros/${progress?.read?.bookId}`}
                                                    className="font-semibold"
                                                >
                                                    {progress.read?.book?.title}
                                                </LinkUnderline>
                                                <span className="mt-[2px] text-xs font-semibold text-gray-500">
                                                    {format(
                                                        parseISO(progress?.createdAt.toString()),
                                                        "dd/MM/yyyy",
                                                        { locale: pt },
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {progress.description && (
                                            <p className="mt-2 text-justify text-sm">
                                                {progress.description}
                                            </p>
                                        )}

                                        <div className="mt-4 flex items-center">
                                            <div className="flex items-center gap-1 text-sm font-medium">
                                                <span>{progress.page}</span>
                                            </div>
                                            <div className="relative mx-2 h-5 flex-1 overflow-hidden rounded border-black bg-white dark:bg-gray-700">
                                                <div
                                                    className="h-5 bg-pink-500"
                                                    style={{
                                                        width: `${progress.percentage}%` ?? 0,
                                                    }}
                                                ></div>
                                                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold">
                                                    {`${progress.percentage}%`}
                                                </span>
                                            </div>
                                            <span className="w-8 text-sm font-medium">
                                                {progress.read?.book?.pageCount}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
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
                        {userData.user?.id && (
                            <UserActivities userId={userData.user.id as string} />
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
}
