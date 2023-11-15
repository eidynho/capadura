"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { ImageIcon } from "lucide-react";

import { ReadData } from "@/endpoints/queries/readsQueries";

import { ProgressBar } from "@/app/(app)/livros/[id]/components/Read/Progress/ProgressBar";
import { RatingStars } from "@/components/RatingStars";

interface CardUserReadProps {
    read: ReadData;
}

export function CardUserRead({ read }: CardUserReadProps) {
    if (!read.book) return;

    return (
        <div className="flex h-36 w-full items-start gap-4 rounded-md border bg-white bg-opacity-80 px-4 py-3 transition-colors dark:bg-dark">
            <div className="h-[7.5rem] w-20 overflow-hidden rounded-sm">
                {read.book.imageUrl ? (
                    <Link href={`/livros/${read.book.id}/leituras/${read.id}`}>
                        <Image
                            src={read.book.imageUrl}
                            width={80}
                            height={120}
                            loading="eager"
                            quality={100}
                            alt={`Capa do livro ${read.book.title}`}
                            title={`Capa do livro ${read.book.title}`}
                            className="w-full overflow-hidden"
                            unoptimized
                        />
                    </Link>
                ) : (
                    <div className="flex h-full items-center justify-center rounded-sm border">
                        <ImageIcon size={20} className="text-muted-foreground" />
                    </div>
                )}
            </div>

            <div className="flex h-full w-full flex-1 flex-col justify-between gap-2">
                <div className="flex w-full items-start justify-between gap-2">
                    <Link
                        href={`/livros/${read.book.id}/leituras/${read.id}`}
                        title={read.book.title}
                        className="font-semibold leading-none tracking-tight text-black hover:underline dark:text-white"
                    >
                        {read.book.title}
                    </Link>

                    {!!read.reviewRating && <RatingStars rating={read.reviewRating} />}
                </div>

                <div>
                    <div className="my-1 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm font-medium text-muted-foreground">
                            Início da leitura:{" "}
                            {format(new Date(read.startDate), "dd 'de' MMMM 'de' yyyy", {
                                locale: pt,
                            })}
                        </div>
                        {read.endDate && (
                            <div className="text-sm font-medium text-muted-foreground">
                                Fim da leitura:{" "}
                                {format(new Date(read.endDate), "dd 'de' MMMM 'de' yyyy", {
                                    locale: pt,
                                })}
                            </div>
                        )}
                    </div>

                    {read.status === "ACTIVE" && read.book.pageCount && (
                        <ProgressBar
                            bookPageCount={read.book.pageCount}
                            currentPage={read.progress?.[0]?.page}
                            currentPercentage={read.progress?.[0]?.percentage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
