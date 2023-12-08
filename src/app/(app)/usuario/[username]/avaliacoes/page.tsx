"use client";

import { useEffect, useState } from "react";
import { notFound, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";
import {
    RatingsOptions,
    ReadData,
    useFetchReadsByReviewRatingsAndUser,
} from "@/endpoints/queries/readsQueries";
import { useFetchUserByUsername } from "@/endpoints/queries/usersQueries";

import { Button } from "@/components/ui/Button";
import { CardUserHover } from "@/components/CardUserHover";
import { CardUserRead } from "../_components/CardUserRead";
import { Separator } from "@/components/ui/Separator";
import { Subtitle } from "@/components/Subtitle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Title } from "@/components/Title";

interface TabData {
    items: ReadData[];
    total: number;
    page: number;
    firstFetch: boolean;
}

interface ReadsData {
    0.5: TabData;
    1: TabData;
    1.5: TabData;
    2: TabData;
    2.5: TabData;
    3: TabData;
    3.5: TabData;
    4: TabData;
    4.5: TabData;
    5: TabData;
}

interface UserReviewsProps {
    params: {
        username: string;
    };
}

export default function UserReviews({ params }: UserReviewsProps) {
    const { username } = params;

    const [currentTab, setCurrentTab] = useState<RatingsOptions>("5");
    const [reads, setReads] = useState<ReadsData>({
        0.5: {
            items: [],
            total: 0,
            page: 1,
            firstFetch: false,
        },
        1: {
            items: [],
            total: 0,
            page: 1,
            firstFetch: false,
        },
        1.5: {
            items: [],
            total: 0,
            page: 1,
            firstFetch: false,
        },
        2: {
            items: [],
            total: 0,
            page: 1,
            firstFetch: false,
        },
        2.5: {
            items: [],
            total: 0,
            page: 1,
            firstFetch: false,
        },
        3: {
            items: [],
            total: 0,
            page: 1,
            firstFetch: false,
        },
        3.5: {
            items: [],
            total: 0,
            page: 1,
            firstFetch: false,
        },
        4: {
            items: [],
            total: 0,
            page: 1,
            firstFetch: false,
        },
        4.5: {
            items: [],
            total: 0,
            page: 1,
            firstFetch: false,
        },
        5: {
            items: [],
            total: 0,
            page: 1,
            firstFetch: true,
        },
    });

    // ----- queries ----- //
    const {
        data: targetUser,
        isFetched: isFetchedUser,
        isError: isErrorFetchUser,
    } = useFetchUserByUsername({
        username: username,
        enabled: !!username,
    });

    const isCurrentUser = isPageUserSameCurrentUser(username);

    const { data: activeUser } = useFetchUserByUsername({
        username: username,
        enabled: !!username,
    });

    const {
        data: fetchedReads,
        isFetching,
        isFetched,
        refetch,
    } = useFetchReadsByReviewRatingsAndUser({
        rating: currentTab,
        userId: activeUser?.id || "",
        page: reads[currentTab].page,
        perPage: 20,
        enabled: !!activeUser?.id && !!currentTab,
    });

    const searchParams = useSearchParams();
    const rating = searchParams.get("rating");
    useEffect(() => {
        if (!rating) return;

        const acceptedRatings = ["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"];
        const isValidRating = acceptedRatings.indexOf(rating) !== -1;

        if (isValidRating) {
            setCurrentTab(rating as RatingsOptions);
        }
    }, [rating]);

    useEffect(() => {
        if (isFetched && fetchedReads) {
            setReads((prev) => {
                const allReads = [...prev[currentTab].items, fetchedReads.items].flat();
                const uniqueReadsSet = new Set(allReads);

                return {
                    ...prev,
                    [currentTab]: {
                        ...prev[currentTab],
                        items: [...uniqueReadsSet],
                        total: fetchedReads.total,
                    },
                };
            });
        }
    }, [isFetched, reads[currentTab].firstFetch]);

    useEffect(() => {
        if (!reads[currentTab].firstFetch) {
            refetch();
            setReads((prev) => ({
                ...prev,
                [currentTab]: {
                    ...prev[currentTab],
                    firstFetch: true,
                },
            }));
        }
    }, [currentTab]);

    if ((isFetchedUser && !targetUser) || isErrorFetchUser) {
        notFound();
    }

    if (!activeUser) return;

    const hasMoreReads = reads[currentTab].total > reads[currentTab].items.length;

    function fetchMoreReads() {
        if (isFetching || !hasMoreReads) return;

        setReads((prev) => ({
            ...prev,
            [currentTab]: {
                ...prev[currentTab],
                page: prev[currentTab].page + 1,
            },
        }));
    }

    function onTabChange(value: string) {
        const acceptedRatings = ["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"];
        const isValidRating = acceptedRatings.indexOf(value) !== -1;

        if (isValidRating) {
            setCurrentTab(value as RatingsOptions);
        }
    }

    function LoadingCards() {
        return (
            <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
                {Array.from({ length: 4 }, (_, index) => (
                    <div
                        key={index}
                        className="flex h-36 w-full items-start gap-4 rounded-md border px-4 py-3 transition-colors"
                    >
                        <div className="h-[7.5rem] w-20 overflow-hidden rounded-sm bg-zinc-300 dark:bg-accent"></div>
                        <div className="flex h-full w-3/4 flex-col justify-between">
                            <div className="h-6 w-32 overflow-hidden rounded-sm bg-zinc-300 dark:bg-accent"></div>
                            <div>
                                <div className="mb-2 h-5 w-2/4 overflow-hidden rounded-sm bg-zinc-300 dark:bg-accent"></div>
                                <div className="h-5 w-3/4 overflow-hidden rounded-sm bg-zinc-300 dark:bg-accent"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                <div>
                    <Title>
                        {isCurrentUser ? "Minhas avaliações" : `Avaliações de ${username}`}
                    </Title>
                    {isCurrentUser && (
                        <Subtitle>Acompanhe todas suas avaliações em um só lugar.</Subtitle>
                    )}
                </div>

                {targetUser && <CardUserHover user={targetUser} />}
            </div>

            <Separator className="my-6" />

            <div className="flex flex-col justify-center">
                <Tabs
                    value={currentTab}
                    onValueChange={onTabChange}
                    defaultValue="5"
                    className="mx-auto"
                >
                    <TabsList>
                        {["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"].map(
                            (rating) => (
                                <TabsTrigger
                                    value={rating}
                                    disabled={isFetching}
                                    className="sm:min-w-[3rem]"
                                >
                                    {rating}
                                </TabsTrigger>
                            ),
                        )}
                    </TabsList>
                </Tabs>

                {reads[currentTab].items.length ? (
                    <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
                        {reads[currentTab].items.map((read) => (
                            <CardUserRead key={read.id} read={read} />
                        ))}
                    </div>
                ) : (
                    !isFetching && (
                        <div className="mt-2 flex h-36 w-full flex-col items-center justify-center rounded-md border bg-white text-center transition-colors dark:bg-dark">
                            <span className="text-base font-semibold text-black dark:text-white">
                                Nenhuma avaliação com nota {currentTab}.
                            </span>
                            <p className="mt-2 px-4 text-sm leading-6 text-muted-foreground sm:w-[26rem]">
                                Avalie suas leituras para aparecer aqui.
                            </p>
                        </div>
                    )
                )}

                {isFetching && <LoadingCards />}

                {hasMoreReads && (
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={fetchMoreReads}
                        disabled={!hasMoreReads}
                        className="mt-2"
                    >
                        {isFetching ? (
                            <>
                                <Loader2 size={22} className="animate-spin" />
                                <span>Carregando...</span>
                            </>
                        ) : (
                            <span>Carregar mais leituras</span>
                        )}
                    </Button>
                )}
            </div>
        </>
    );
}
