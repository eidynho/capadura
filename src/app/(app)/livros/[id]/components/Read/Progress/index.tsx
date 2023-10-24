"use client";

import Link from "next/link";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { MoreVertical } from "lucide-react";

import { DeleteProgressData, EditReadData } from "..";
import { ProfileDataResponse } from "@/endpoints/queries/usersQueries";
import { ProgressData } from "@/endpoints/queries/progressQueries";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CardUserHover } from "@/components/CardUserHover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { ProgressBar } from "./ProgressBar";

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
                                        new Date(progress.createdAt),
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

                        <div className="mt-4 flex flex-col items-start gap-2">
                            {progress.isSpoiler && (
                                <Badge variant="red" className="min-w-[103px]">
                                    Contém spoiler
                                </Badge>
                            )}

                            {progress.description && (
                                <p className="max-h-56 overflow-auto text-justify text-black dark:text-white">
                                    {progress.description}
                                </p>
                            )}
                        </div>

                        <ProgressBar
                            bookPageCount={bookPageCount}
                            currentPage={progress.page}
                            currentPercentage={progress.percentage}
                        />
                    </div>
                ))
            ) : (
                <span>Nenhum progresso encontrado.</span>
            )}
        </div>
    );
}
