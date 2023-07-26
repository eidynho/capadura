import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { Link as LinkIcon, MapPin, TwitterLogo, User } from "phosphor-react";
import { api } from "@/lib/api";

import { ProfileData } from "@/contexts/AuthContext";
import { ProgressData, ReadData } from "../books/[id]";

import { Button } from "@/components/Button";
import { LinkUnderline } from "@/components/LinkUnderline";
import { RatingStars } from "@/components/RatingStars";
import { Container } from "@/components/layout/Container";
import { RatingChart } from "@/components/RatingChart";
import { UserFavoriteBooks } from "@/components/dialogs/UserFavoriteBooks";

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

export default function Me() {
    const router = useRouter();

    const [isMounted, setIsMounted] = useState(false);
    const [userData, setUserData] = useState<UserData>({
        user: {
            id: "",
            name: "",
            username: "",
            email: "",
            createdAt: undefined,
            description: null,
            favoriteBooks: [],
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

    useEffect(() => {
        if (!router.isReady) return;

        async function fetchUserData() {
            try {
                setIsMounted(false);
                const userResponse = await api.get(`/users/${router.query.id}`);
                const userId = userResponse.data.user.id;

                const readsPromise = api.get(
                    `/user-reads?userId=${userId}&status=FINISHED&page=1&perPage=3`,
                );
                const progressPromise = api.get(`/user-progress/${userId}?page=1&perPage=3`);

                const [readsResponse, progressResponse] = await Promise.all([
                    readsPromise,
                    progressPromise,
                ]);

                setUserData({
                    user: userResponse.data.user,
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
    }, [router.isReady, router.query.id]);

    function renderHeaderInfo() {
        return (
            <>
                {!isMounted ? (
                    <div className="flex w-full animate-pulse flex-col gap-5 md:w-[28rem]">
                        <div className="mt-1 flex gap-x-8 gap-y-3">
                            <div className="h-6 w-20 items-center rounded-lg bg-gray-200"></div>
                            <div className="h-6 w-20 items-center rounded-lg bg-gray-200"></div>
                            <div className="h-6 w-20 items-center rounded-lg bg-gray-200"></div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="h-5 w-full items-center rounded-lg bg-gray-200"></div>
                            <div className="h-5 w-2/3 items-center rounded-lg bg-gray-200"></div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                            <div className="h-6 w-24 items-center rounded-lg bg-gray-200"></div>
                            <div className="h-6 w-24 items-center rounded-lg bg-gray-200"></div>
                            <div className="h-6 w-24 items-center rounded-lg bg-gray-200"></div>
                        </div>
                    </div>
                ) : (
                    <div className="flex w-full flex-col gap-5 md:w-[28rem]">
                        <div className="mt-1 flex gap-x-8 gap-y-3">
                            <LinkUnderline href="">
                                <span className="font-semibold">234</span>
                                <span>livros</span>
                            </LinkUnderline>

                            <LinkUnderline href="">
                                <span className="font-semibold">234</span>
                                <span>seguidores</span>
                            </LinkUnderline>

                            <LinkUnderline href="">
                                <span className="font-semibold">5535</span>
                                <span>seguindo</span>
                            </LinkUnderline>
                        </div>

                        {userData.user.description && (
                            <h1 className="text-sm">{userData.user.description}</h1>
                        )}

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                            {userData.user.location && (
                                <div className="flex items-center gap-1">
                                    <MapPin size={20} />

                                    <span>{userData.user.location}</span>
                                </div>
                            )}

                            {userData.user.website && (
                                <div className="flex items-center gap-1">
                                    <LinkIcon size={20} />

                                    <LinkUnderline href="" className="font-semibold">
                                        {userData.user.website}
                                    </LinkUnderline>
                                </div>
                            )}

                            {userData.user.twitter && (
                                <div className="flex items-center gap-1">
                                    <TwitterLogo size={20} />
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
                )}
            </>
        );
    }

    // render loading
    if (!isMounted) {
        return (
            <Container>
                <div className="flex animate-pulse flex-col items-start justify-center md:flex-row">
                    <div className="flex items-start gap-8">
                        <div className="flex h-28 w-28 items-center gap-4 rounded-full bg-gray-200"></div>

                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start">
                                <div>
                                    <div className="mb-2 h-6 w-48 items-center rounded-lg bg-gray-200"></div>
                                    <div className="h-5 w-32 items-center rounded-lg bg-gray-200"></div>
                                </div>
                                <div className="h-9 w-24 items-center rounded-lg bg-gray-200"></div>
                            </div>

                            <div className="hidden md:block">{renderHeaderInfo()}</div>
                        </div>
                    </div>

                    <div className="block md:hidden">{renderHeaderInfo()}</div>
                </div>

                <div className="mt-8 flex flex-col justify-center gap-12 lg:flex-row">
                    <div className="flex w-full flex-col gap-12 lg:w-3/5">
                        <div className="flex flex-col">
                            <div className="mb-1 h-6 w-32 items-center rounded-lg bg-gray-200"></div>

                            <div className="flex items-center justify-between gap-3">
                                {Array.from({ length: 4 }, (_, index) => (
                                    <div
                                        key={index}
                                        className="h-64 w-44 items-center rounded-lg bg-gray-200"
                                    ></div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="mb-1 h-6 w-40 items-center rounded-lg bg-gray-200"></div>

                            {Array.from({ length: 3 }, (_, index) => (
                                <div
                                    key={index}
                                    className="flex gap-4 border-t border-black/20 py-4 last:border-b"
                                >
                                    <div className="h-28 w-20 items-center rounded-lg bg-gray-200"></div>
                                    <div className="w-full">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="mb-1 h-6 w-44 items-center rounded-lg bg-gray-200"></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <div className="h-5 w-32 items-center rounded-lg bg-gray-200"></div>
                                        </div>

                                        <div className="mt-3 h-4 w-2/3 items-center rounded-lg bg-gray-200"></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col">
                            <div className="mb-1 h-6 w-40 items-center rounded-lg bg-gray-200"></div>

                            {Array.from({ length: 3 }, (_, index) => (
                                <div
                                    key={index}
                                    className="flex gap-4 border-t border-black/20 py-4 last:border-b"
                                >
                                    <div className="h-28 w-20 items-center rounded-lg bg-gray-200"></div>

                                    <div className="w-full">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="mb-1 flex items-center gap-2">
                                                <div className="h-6 w-44 items-center rounded-lg bg-gray-200"></div>

                                                <div className="h-4 w-20 items-center rounded-lg bg-gray-200"></div>
                                            </div>
                                        </div>

                                        <div className="mt-3 h-4 w-2/3 items-center rounded-lg bg-gray-200"></div>

                                        <div className="mt-4 h-7 w-full items-center rounded-lg bg-gray-200"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-4 sm:flex-row lg:w-72 lg:flex-col">
                        <div className="w-full sm:w-1/2 lg:w-full">
                            <div className="mb-1 h-6 w-24 items-center rounded-lg bg-gray-200"></div>

                            <div className="h-64 w-full items-center rounded-lg bg-gray-200"></div>
                        </div>

                        <div className="w-full sm:w-1/2 lg:w-full">
                            <div className="mb-1 h-6 w-24 items-center rounded-lg bg-gray-200"></div>

                            <div className="h-40 w-full items-center rounded-lg bg-gray-200"></div>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="flex flex-col items-start justify-center md:flex-row">
                <div className="flex items-start gap-8">
                    <User size={120} />
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start">
                            <div>
                                <h2 className="text-xl font-bold leading-6">
                                    {userData.user.name}
                                </h2>
                                <span className="tracking-wide">@{userData.user.username}</span>
                            </div>
                            <Button asChild size="sm">
                                <Link href="/config">Editar perfil</Link>
                            </Button>
                        </div>

                        <div className="hidden md:block">{renderHeaderInfo()}</div>
                    </div>
                </div>

                <div className="block md:hidden">{renderHeaderInfo()}</div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-12 lg:flex-row">
                <div className="flex w-full flex-col gap-12 lg:w-3/5">
                    <div className="flex flex-col">
                        <h3 className="font-semibold">Livros favoritos</h3>

                        <div className="flex items-center justify-between gap-3">
                            {Array.from({ length: 4 }, (_, index) => (
                                <UserFavoriteBooks
                                    key={index}
                                    user={userData.user}
                                    setUserData={setUserData}
                                    itemId={index}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <h3 className="font-semibold">Leituras finalizadas</h3>

                        {userData.reads?.items?.length &&
                            userData.reads.items.map((read) => (
                                <div className="flex gap-4 border-t border-black/20 py-4 last:border-b">
                                    <div className="h-28 w-20 rounded-lg border border-black"></div>
                                    <div className="w-full">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <LinkUnderline
                                                    href={`/books/${read.bookId}`}
                                                    className="font-semibold"
                                                >
                                                    {read.book?.title}
                                                </LinkUnderline>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            {read.reviewRating && (
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
                                    <div className="h-28 w-20 rounded-lg border border-black"></div>
                                    <div className="w-full">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <LinkUnderline
                                                    href={`/books/${progress?.read?.bookId}`}
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

                <div className="flex w-full flex-col gap-4 sm:flex-row lg:w-72 lg:flex-col">
                    <div className="w-full sm:w-1/2 lg:w-full">
                        <h3 className="font-semibold">Calendário</h3>
                        <div className="h-64 w-full rounded-lg border border-black"></div>
                    </div>

                    <div className="w-full sm:w-1/2 lg:w-full">
                        <h3 className="font-semibold">Avaliações</h3>
                        {userData.user?.id && <RatingChart userId={userData.user.id as string} />}
                    </div>
                </div>
            </div>
        </Container>
    );
}
