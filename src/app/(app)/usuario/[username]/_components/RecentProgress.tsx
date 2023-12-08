"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { ImageIcon } from "lucide-react";

import { useFetchUserProgress } from "@/endpoints/queries/progressQueries";

import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";
import { ProfileDataResponse } from "@/endpoints/queries/usersQueries";

import { LinkUnderline } from "@/components/LinkUnderline";
import { ProgressBar } from "@/app/(app)/livros/[id]/components/Read/Progress/ProgressBar";

interface RecentProgressProps {
    username: string;
    targetUser: ProfileDataResponse;
}

export function RecentProgress({ username, targetUser }: RecentProgressProps) {
    const isCurrentUser = isPageUserSameCurrentUser(username);

    const { data: userProgress, isFetching } = useFetchUserProgress({
        userId: targetUser?.id || "",
        enabled: !!targetUser?.id,
    });

    if (isFetching) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="flex flex-col text-black dark:text-white">
            <h2 className="font-semibold">Progressos recentes</h2>

            {!!userProgress?.items?.length ? (
                userProgress.items.map((progress) => (
                    <div key={progress.id} className="flex gap-4 border-t py-4 last:border-b">
                        <div className="h-24 w-20 overflow-hidden rounded-sm">
                            {progress.read?.book?.imageUrl ? (
                                <Link href={`/livros/${progress.read.bookId}`}>
                                    <Image
                                        src={progress.read.book.imageUrl}
                                        width={80}
                                        height={96}
                                        loading="eager"
                                        quality={100}
                                        alt={`Capa do livro ${progress.read.book.title}`}
                                        title={`Capa do livro ${progress.read.book.title}`}
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
                                    <LinkUnderline
                                        href={`/livros/${progress.read?.bookId}`}
                                        className="font-semibold"
                                    >
                                        {progress.read?.book?.title}
                                    </LinkUnderline>
                                    <span className="mt-[2px] text-xs font-semibold text-muted-foreground">
                                        {format(new Date(progress?.createdAt), "dd/MM/yyyy", {
                                            locale: pt,
                                        })}
                                    </span>
                                </div>
                            </div>

                            {progress.description && (
                                <p className="mt-2 max-h-56 overflow-auto text-justify text-sm">
                                    {progress.description}
                                </p>
                            )}

                            {progress.read?.book?.pageCount && (
                                <ProgressBar
                                    bookPageCount={progress.read?.book?.pageCount}
                                    currentPage={progress.page}
                                    currentPercentage={progress.percentage}
                                />
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="mt-2 flex h-36 flex-col items-center justify-center rounded-md border bg-white text-center transition-colors dark:bg-dark">
                    <span className="text-base font-semibold text-black dark:text-white">
                        Nenhum progresso recente.
                    </span>
                    <p className="mt-2 px-4 text-sm leading-6 text-muted-foreground sm:w-[26rem]">
                        {isCurrentUser ? (
                            <span>Você ainda não fez nenhum progresso de leitura.</span>
                        ) : (
                            `${username} ainda não tem nenhum progresso de leitura.`
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}

const LoadingSkeleton = () => {
    return (
        <div className="flex animate-pulse flex-col px-4">
            <div className="mb-1 h-6 w-40 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>

            {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="flex gap-4 border-t border-dark/20 py-4 last:border-b">
                    <div className="h-28 w-20 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                    <div className="w-full">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="mb-1 h-6 w-44 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="h-5 w-32 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                        </div>

                        <div className="mt-3 h-4 w-2/3 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};
