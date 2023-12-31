"use client";

import { BookMarked, Heart, List } from "lucide-react";

import { api } from "@/lib/api";
import { BookData } from "@/endpoints/queries/booksQueries";
import { publishDateFormat } from "@/utils/publish-date-format";

import { useQueries } from "@tanstack/react-query";

import { BookListMenu } from "./BookListMenu";
import { Like } from "./Like";

import { Separator } from "@/components/ui/Separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { getISOCode } from "@/utils/get-iso-639-1";

interface BookMetaDataProps {
    bookData: BookData;
}

export interface GetMetadataCount {
    total: number;
}

export function BookMetaData({ bookData }: BookMetaDataProps) {
    const [totalLikeCountByBook, totalFinishedReadsCountByBook, totalListsWithSomeBookCount] =
        useQueries({
            queries: [
                {
                    queryKey: ["getTotalLikeCountByBook", { bookId: bookData.id }],
                    queryFn: async () => {
                        const { data } = await api.get(`get-total-like-count/book/${bookData.id}`);
                        return data as GetMetadataCount;
                    },
                },
                {
                    queryKey: ["getTotalFinishedReadsCountByBook", { bookId: bookData.id }],
                    queryFn: async () => {
                        const { data } = await api.get(
                            `get-total-finished-reads-count/book/${bookData.id}`,
                        );
                        return data as GetMetadataCount;
                    },
                },
                {
                    queryKey: ["getTotalListsWithSomeBookCount", { bookId: bookData.id }],
                    queryFn: async () => {
                        const { data } = await api.get(
                            `/get-total-lists-with-some-book-count/book/${bookData.id}`,
                        );
                        return data as GetMetadataCount;
                    },
                },
            ],
        });

    const notFetched =
        !totalLikeCountByBook?.data ||
        !totalFinishedReadsCountByBook?.data ||
        !totalListsWithSomeBookCount?.data;

    const isLoading =
        totalLikeCountByBook.isLoading ||
        totalFinishedReadsCountByBook.isLoading ||
        totalListsWithSomeBookCount.isLoading;

    if (notFetched || isLoading) {
        return;
    }

    return (
        <>
            <div className="my-3 flex justify-center gap-6 text-sm text-black dark:text-white">
                <TooltipProvider delayDuration={200} skipDelayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                                <Heart size={16} />
                                {totalLikeCountByBook.data.total}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={8}>
                            <span>
                                Curtido por{" "}
                                <span className="font-medium">
                                    {totalLikeCountByBook.data.total}
                                </span>{" "}
                                membro
                                {totalLikeCountByBook.data.total === 1 ? "" : "s"}
                            </span>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={200} skipDelayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                                <BookMarked size={16} />
                                {totalFinishedReadsCountByBook.data.total}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={8}>
                            <span>
                                Lido por{" "}
                                <span className="font-medium">
                                    {totalFinishedReadsCountByBook.data.total}
                                </span>{" "}
                                membro
                                {totalFinishedReadsCountByBook.data.total === 1 ? "" : "s"}
                            </span>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={200} skipDelayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                                <List size={16} />
                                {totalListsWithSomeBookCount.data.total}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={8}>
                            <span>
                                Aparece em{" "}
                                <span className="font-medium">
                                    {totalListsWithSomeBookCount.data.total}
                                </span>{" "}
                                lista
                                {totalListsWithSomeBookCount.data.total === 1 ? "" : "s"}
                            </span>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="rounded-md border bg-white pb-4 text-black transition-colors dark:bg-dark dark:text-white">
                <div className="mx-4 mt-4 flex justify-between text-sm">
                    <span className="font-semibold">Escrito por</span>
                    {!!bookData.authors?.[0] ? (
                        <span className="font-semibold">{bookData.authors[0]}</span>
                    ) : (
                        <span>-</span>
                    )}
                </div>

                <Separator className="my-4" />

                <div className="mx-4 flex justify-between text-sm">
                    <span className="font-semibold">Ano de publicação</span>
                    <span>{publishDateFormat(bookData.publishDate)}</span>
                </div>

                <Separator className="my-4" />

                <div className="mx-4 flex justify-between text-sm">
                    <span className="font-semibold">Editora</span>
                    <span>{bookData.publisher ?? "Sem informação"}</span>
                </div>

                <Separator className="my-4" />

                <div className="mx-4 flex justify-between text-sm">
                    <span className="font-semibold">Idioma</span>
                    <span>{getISOCode(bookData.language)}</span>
                </div>

                <Separator className="my-4" />

                <div className="mx-4 flex justify-between text-sm">
                    <span className="font-semibold">Páginas</span>
                    <span>{bookData.pageCount ?? "Sem informação"}</span>
                </div>

                <Separator className="my-4" />

                <div className="mx-4 flex justify-between text-sm">
                    <span className="font-semibold">ISBN10</span>
                    <span>{bookData.isbn13 ? bookData.isbn13.slice(3) : "Sem informação"}</span>
                </div>

                <div className="mx-4 mt-4 flex justify-between text-sm">
                    <span className="font-semibold">ISBN13</span>
                    <span>{bookData.isbn13 ?? "Sem informação"}</span>
                </div>

                <Separator className="my-4" />

                {/* Book action buttons */}
                <div className="flex w-full items-center justify-center gap-2">
                    <BookListMenu bookData={bookData} />
                    <Like bookId={bookData.id} />
                </div>
            </div>
        </>
    );
}
