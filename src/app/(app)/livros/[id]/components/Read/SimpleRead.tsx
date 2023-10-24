import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ExternalLink, ImageIcon } from "lucide-react";

import { ReadData } from "@/endpoints/queries/readsQueries";

import { Button } from "@/components/ui/Button";
import { CardUserHover } from "@/components/CardUserHover";
import { RatingStars } from "@/components/RatingStars";
import { Separator } from "@/components/ui/Separator";
import { Badge } from "@/components/ui/Badge";

interface SimpleReadProps {
    read: ReadData;
    hasBookImage?: boolean;
}

export function SimpleRead({ read, hasBookImage }: SimpleReadProps) {
    return (
        <div className="w-full rounded-md border bg-white text-sm transition-colors dark:bg-dark">
            <div className="m-6 flex flex-col gap-2 rounded-md">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        {read.user && <CardUserHover user={read.user} />}

                        {!!read.reviewRating && (
                            <Separator orientation="vertical" className="h-6"></Separator>
                        )}

                        {/* Rating stars */}
                        <div className="ml-1 inline-flex items-center gap-2">
                            {!!read.reviewRating && (
                                <div className="inline-flex items-center">
                                    <RatingStars rating={read.reviewRating} />
                                </div>
                            )}

                            {!!read.reviewRating && hasBookImage && read.book?.title && (
                                <span className="text-black dark:text-white">-</span>
                            )}

                            {hasBookImage && read.book?.title && (
                                <Link
                                    href={`/livros/${read.book.id}`}
                                    className="font-medium text-black hover:underline dark:text-white"
                                >
                                    {read.book.title}
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {read.endDate && (
                            <div className="text-xs font-medium text-muted-foreground">
                                {format(new Date(read.endDate), "dd/MM/yyyy")}
                            </div>
                        )}

                        <Link href={`/livros/${read.bookId}/leituras/${read.id}`}>
                            <Button size="icon-sm" variant="default">
                                <ExternalLink size={16} />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="mt-2 flex gap-4">
                    {hasBookImage && read.book && (
                        <div className="h-[7.5rem] w-20 overflow-hidden rounded-sm">
                            {read.book.imageUrl ? (
                                <Link href={`/livros/${read.book.id}`}>
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
                    )}

                    <div className="flex flex-1 flex-col items-start gap-1">
                        {read.reviewIsSpoiler && <Badge variant="red">Contém spoiler</Badge>}
                        {read.reviewContent && (
                            <p className="max-h-56 overflow-auto text-black dark:text-white">
                                {read.reviewContent}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
