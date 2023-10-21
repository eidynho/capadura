import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ExternalLink } from "lucide-react";

import { ReadData } from "@/endpoints/queries/readsQueries";

import { Button } from "@/components/ui/Button";
import { CardUserHover } from "@/components/CardUserHover";
import { RatingStars } from "@/components/RatingStars";
import { Separator } from "@/components/ui/Separator";

interface SimpleReadProps {
    read: ReadData;
}

export function SimpleRead({ read }: SimpleReadProps) {
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
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {read.endDate && (
                            <div className="text-xs font-medium text-muted-foreground">
                                {format(parseISO(read.endDate.toString()), "dd/MM/yyyy")}
                            </div>
                        )}

                        <Link href={`/livros/${read.bookId}/leituras/${read.id}`}>
                            <Button size="icon-sm" variant="default">
                                <ExternalLink size={16} />
                            </Button>
                        </Link>
                    </div>
                </div>

                {read.reviewContent && (
                    <p className="mt-2 text-justify text-black dark:text-white">
                        {read.reviewContent}
                    </p>
                )}
            </div>
        </div>
    );
}
