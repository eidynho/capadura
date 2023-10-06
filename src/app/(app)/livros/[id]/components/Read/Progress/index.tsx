"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { MoreVertical } from "lucide-react";

import { DeleteProgressData, EditReadData } from "..";
import { ProfileDataResponse } from "@/endpoints/queries/usersQueries";
import { ProgressData } from "@/endpoints/queries/progressQueries";

import { Button } from "@/components/ui/Button";
import { CardUserHover } from "@/components/CardUserHover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

interface ProgressProps {
    canEdit: boolean;
    user: ProfileDataResponse;
    readId: string;
    bookId: string;
    showMoreProgressBtn: boolean;
    progressList?: ProgressData[];
    bookPageCount: number;
    setProgressEditData: ({
        readId,
        id,
        description,
        isSpoiler,
        page,
        countType,
    }: EditReadData) => void;
    setProgressDeleteData: ({ readId, progressId }: DeleteProgressData) => void;
}

export function Progress({
    user,
    canEdit,
    readId,
    bookId,
    showMoreProgressBtn,
    progressList,
    bookPageCount,
    setProgressEditData,
    setProgressDeleteData,
}: ProgressProps) {
    return (
        <div className="mt-2 flex flex-col gap-3 text-black dark:text-white">
            <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold">Progressos recentes</h4>
                {showMoreProgressBtn && (
                    <Link href={`/livros/${bookId}/leituras/${readId}`}>
                        <Button size="sm" variant="outline">
                            Ver mais
                        </Button>
                    </Link>
                )}
            </div>
            {!!progressList?.length ? (
                progressList.map((progress) => (
                    <div key={progress.id} className="border-t p-4">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                                {user && <CardUserHover user={user} />}

                                <span className="mt-[2px] text-xs text-muted-foreground">
                                    {format(
                                        parseISO(progress.createdAt.toString()),
                                        "dd 'de' MMMM 'de' yyyy",
                                        { locale: pt },
                                    )}
                                </span>
                            </div>

                            {canEdit && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon-sm" variant="default">
                                            <MoreVertical
                                                size={16}
                                                className="text-black dark:text-white"
                                            />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setProgressEditData({
                                                    ...progress,
                                                    countType: "page",
                                                })
                                            }
                                        >
                                            <span>Editar</span>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() =>
                                                setProgressDeleteData({
                                                    progressId: progress.id,
                                                    readId: progress.readId,
                                                })
                                            }
                                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                        >
                                            <span>Excluir</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        {progress.description && (
                            <p className="mt-2 text-justify text-black dark:text-white">
                                {progress.description}
                            </p>
                        )}

                        <div className="mt-4 flex items-center">
                            <div className="flex items-center gap-1 text-sm font-medium">
                                <span>{progress.page}</span>
                            </div>
                            <div className="relative mx-2 h-5 flex-1 overflow-hidden rounded border bg-muted dark:bg-muted-foreground/25">
                                <div
                                    className="h-5 bg-primary/50"
                                    style={{
                                        width: `${progress.percentage}%` ?? 0,
                                    }}
                                ></div>
                                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-black">
                                    {`${progress.percentage}%`}
                                </span>
                            </div>
                            <span className="w-8 text-sm font-medium">{bookPageCount}</span>
                        </div>
                    </div>
                ))
            ) : (
                <span>Nenhum progresso encontrado.</span>
            )}
        </div>
    );
}
