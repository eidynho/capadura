"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import {
    RatingsOptions,
    ReadsDataResponse,
    useFetchReadsByReviewRatingsAndBook,
} from "@/endpoints/queries/readsQueries";

import { Button } from "@/components/ui/Button";
import { SimpleRead } from "../../../components/Read/SimpleRead";

interface ClientBookReviewsProps {
    bookId: string;
    rating: RatingsOptions;
}

export function ClientBookReviews({ bookId, rating }: ClientBookReviewsProps) {
    const [page, setPage] = useState(1);
    const [fullReviewsList, setFullReviewsList] = useState<ReadsDataResponse>({
        items: [],
        total: 0,
    });

    const {
        data: reviewsList,
        isFetching,
        isFetched,
    } = useFetchReadsByReviewRatingsAndBook({
        rating,
        bookId,
        page,
        perPage: 20,
        enabled: !!bookId && !!rating,
    });

    useEffect(() => {
        if (isFetched && reviewsList) {
            setFullReviewsList((prev) => {
                const allReviews = [...prev.items, reviewsList.items].flat();
                const uniqueReviewsSet = new Set(allReviews);

                return {
                    items: [...uniqueReviewsSet],
                    total: reviewsList.total,
                };
            });
        }
    }, [isFetched]);

    if (!reviewsList) return;

    const hasMoreReviews = reviewsList.total > fullReviewsList.items.length;

    function fetchMoreReviews() {
        if (hasMoreReviews) {
            setPage((prev) => prev + 1);
        }
    }

    function LoadingCards() {
        return (
            <div className="mt-2 flex animate-pulse flex-col gap-2">
                {Array.from({ length: 2 }, (_, index) => (
                    <div
                        key={index}
                        className="w-full items-center rounded-md border border-zinc-300 p-6 dark:border-accent"
                    >
                        <div className="flex items-center justify-between pr-2">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 items-center rounded-full bg-zinc-300 dark:bg-accent"></div>
                                <div className="h-6 w-40 items-center rounded bg-zinc-300 dark:bg-accent"></div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="h-6 w-20 items-center rounded bg-zinc-300 dark:bg-accent"></div>
                                <div className="h-6 w-6 items-center rounded bg-zinc-300 dark:bg-accent"></div>
                            </div>
                        </div>

                        <div className="mt-6 h-4 w-1/2 items-center rounded bg-zinc-300 dark:bg-accent"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center">
            <h2 className="mb-3 text-lg font-medium text-black dark:text-white">
                Avaliações - Nota {rating}
            </h2>

            {fullReviewsList.items.length ? (
                <div className="flex flex-col gap-2">
                    {fullReviewsList.items.map((read) => (
                        <SimpleRead read={read} />
                    ))}
                </div>
            ) : (
                !isFetching && (
                    <div className="mt-2 flex h-36 w-full flex-col items-center justify-center rounded-md border bg-white text-center transition-colors dark:bg-dark">
                        <span className="text-base font-semibold text-black dark:text-white">
                            Nenhuma avaliação com nota {rating} para esse livro.
                        </span>
                        <p className="mt-2 w-[26rem] text-sm leading-6 text-muted-foreground">
                            As avaliações dos membros aparecerão aqui.
                        </p>
                    </div>
                )
            )}

            {isFetching && <LoadingCards />}

            {hasMoreReviews && isFetched && (
                <Button
                    size="sm"
                    variant="primary"
                    onClick={fetchMoreReviews}
                    disabled={!hasMoreReviews}
                    className="mt-2"
                >
                    {isFetching ? (
                        <>
                            <Loader2 size={22} className="animate-spin" />
                            <span>Carregando...</span>
                        </>
                    ) : (
                        <span>Carregar mais avaliações</span>
                    )}
                </Button>
            )}
        </div>
    );
}
