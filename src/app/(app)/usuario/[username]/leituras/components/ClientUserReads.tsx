"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";
import { ReadData, useFetchUserReadsByStatus } from "@/endpoints/queries/readsQueries";
import { useFetchUserByUsername } from "@/endpoints/queries/usersQueries";

import { Button } from "@/components/ui/Button";
import { CardUserRead } from "../../_components/CardUserRead";
import { Separator } from "@/components/ui/Separator";
import { Subtitle } from "@/components/Subtitle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Title } from "@/components/Title";

interface ClientUserReadsProps {
    username: string;
}

interface TabData {
    items: ReadData[];
    total: number;
    page: number;
    firstFetch: boolean;
    humanized: string;
}

interface ReadsData {
    ACTIVE: TabData;
    FINISHED: TabData;
    CANCELLED: TabData;
}

export function ClientUserReads({ username }: ClientUserReadsProps) {
    const [currentTab, setCurrentTab] = useState<"ACTIVE" | "FINISHED" | "CANCELLED">("ACTIVE");
    const [reads, setReads] = useState<ReadsData>({
        ACTIVE: {
            items: [],
            total: 0,
            page: 1,
            firstFetch: true,
            humanized: "em andamento",
        },
        FINISHED: {
            items: [],
            total: 0,
            page: 1,
            firstFetch: false,
            humanized: "finalizada",
        },
        CANCELLED: {
            items: [],
            total: 0,
            page: 1,
            firstFetch: false,
            humanized: "cancelada",
        },
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
    } = useFetchUserReadsByStatus({
        userId: activeUser?.id || "",
        status: currentTab,
        page: reads[currentTab].page,
        perPage: 20,
        enabled: !!activeUser?.id && !!currentTab,
    });

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
    }, [isFetched]);

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
        if (value === "ACTIVE" || value === "FINISHED" || value === "CANCELLED") {
            setCurrentTab(value);
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
            <Title>{isCurrentUser ? "Minhas leituras" : `Leituras de ${username}`}</Title>
            {isCurrentUser && <Subtitle>Acompanhe todas suas leituras.</Subtitle>}

            <Separator className="my-6" />

            <div className="flex flex-col justify-center">
                <Tabs value={currentTab} onValueChange={onTabChange} defaultValue="ACTIVE">
                    <TabsList>
                        <TabsTrigger value="ACTIVE" disabled={isFetching}>
                            Em andamento
                        </TabsTrigger>
                        <TabsTrigger value="FINISHED" disabled={isFetching}>
                            Finalizadas
                        </TabsTrigger>
                        <TabsTrigger value="CANCELLED" disabled={isFetching}>
                            Canceladas
                        </TabsTrigger>
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
                                Nenhuma leitura {reads[currentTab].humanized}.
                            </span>
                            <p className="mt-2 w-[26rem] text-sm leading-6 text-muted-foreground">
                                Verifique se o status da sua leitura está correto.
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
