import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { ExternalLink, ImageIcon } from "lucide-react";

import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";
import { ReadData } from "@/endpoints/queries/readsQueries";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RatingStars } from "@/components/RatingStars";

interface FinishedReadsProps {
    username: string;
    readsData: {
        items: ReadData[];
        total: number;
    };
}

export function FinishedReads({ username, readsData }: FinishedReadsProps) {
    const isCurrentUser = isPageUserSameCurrentUser(username);

    return (
        <div className="flex flex-col text-black dark:text-white">
            <h2 className="font-semibold">Leituras finalizadas</h2>

            {!!readsData.items?.length ? (
                readsData.items.map((read) => (
                    <div key={read.id} className="flex gap-4 border-t py-4 last:border-b">
                        <div className="h-24 w-20 overflow-hidden rounded-sm">
                            {read?.book?.imageUrl ? (
                                <Link href={`/livros/${read.bookId}`}>
                                    <Image
                                        src={read.book.imageUrl}
                                        width={80}
                                        height={96}
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

                        <div className="w-full">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/livros/${read.bookId}`}
                                        className="font-semibold hover:underline"
                                    >
                                        {read.book?.title}
                                    </Link>
                                </div>

                                <div className="flex items-center gap-1">
                                    {read.reviewIsSpoiler && (
                                        <Badge variant="red" className="min-w-[103px]">
                                            Contém spoiler
                                        </Badge>
                                    )}
                                    <Link href={`/livros/${read.bookId}/leituras/${read.id}`}>
                                        <Button size="icon-sm" variant="default">
                                            <ExternalLink size={16} />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center">
                                {!!read.reviewRating && <RatingStars rating={read.reviewRating} />}

                                {read.endDate && (
                                    <div className="ml-3 flex items-center gap-1 text-muted-foreground">
                                        <span className="text-sm font-medium">Finalizado em</span>
                                        <span className="mt-[2px] text-xs font-semibold">
                                            {format(new Date(read?.endDate), "dd/MM/yyyy", {
                                                locale: pt,
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {read?.reviewContent && (
                                <p className="mt-2 max-h-56 overflow-auto text-justify text-sm">
                                    {read?.reviewContent}
                                </p>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="mt-2 flex h-36 flex-col items-center justify-center rounded-md border bg-white text-center transition-colors dark:bg-dark">
                    <span className="text-base font-semibold text-black dark:text-white">
                        Nenhuma leitura finalizada.
                    </span>
                    <p className="mt-2 px-4 text-sm leading-6 text-muted-foreground sm:w-[26rem]">
                        {isCurrentUser
                            ? "Você ainda não terminou de ler um livro, vamos registar algum?"
                            : `${username} ainda não terminou de ler nenhum livro.`}
                    </p>
                </div>
            )}
        </div>
    );
}
