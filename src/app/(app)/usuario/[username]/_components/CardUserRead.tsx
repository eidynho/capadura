import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { ImageIcon } from "lucide-react";

import { ReadData } from "@/endpoints/queries/readsQueries";

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
                            {format(parseISO(read.startDate.toString()), "dd 'de' MMMM 'de' yyyy", {
                                locale: pt,
                            })}
                        </div>
                        {read.endDate && (
                            <div className="text-sm font-medium text-muted-foreground">
                                Fim da leitura:{" "}
                                {format(
                                    parseISO(read.endDate.toString()),
                                    "dd 'de' MMMM 'de' yyyy",
                                    {
                                        locale: pt,
                                    },
                                )}
                            </div>
                        )}
                    </div>

                    {read.status === "ACTIVE" && (
                        <div className="mt-4 flex items-center">
                            <div className="flex items-center gap-1 text-sm font-medium text-black dark:text-white">
                                <span>{read.progress?.[0]?.page ?? 0}</span>
                            </div>
                            <div className="relative mx-2 h-5 flex-1 overflow-hidden rounded border bg-muted dark:bg-muted-foreground/25">
                                <div
                                    className="h-5 bg-primary/50"
                                    style={{
                                        width: `${read.progress?.[0]?.percentage ?? 0}%`,
                                    }}
                                ></div>
                                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold dark:text-black">
                                    {`${read.progress?.[0]?.percentage ?? 0}%`}
                                </span>
                            </div>
                            <span className="w-8 text-sm font-medium text-black dark:text-white">
                                {read.book.pageCount}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
