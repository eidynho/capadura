import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";

import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";
import { ProgressData } from "@/app/(app)/livros/[id]/page";

import { LinkUnderline } from "@/components/LinkUnderline";
import Link from "next/link";

interface RecentProgressProps {
    username: string;
    progressData: {
        items: ProgressData[];
        total: number;
    };
}

export function RecentProgress({ username, progressData }: RecentProgressProps) {
    const isCurrentUser = isPageUserSameCurrentUser(username);

    return (
        <div className="flex flex-col text-black dark:text-white">
            <h3 className="font-semibold">Progressos recentes</h3>

            {!!progressData?.items?.length ? (
                progressData.items.map((progress) => (
                    <div className="flex gap-4 border-t py-4 last:border-b">
                        <div className="h-28 w-20 rounded-md border border-dark"></div>
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
                                        {format(
                                            parseISO(progress?.createdAt.toString()),
                                            "dd/MM/yyyy",
                                            { locale: pt },
                                        )}
                                    </span>
                                </div>
                            </div>

                            {progress.description && (
                                <p className="mt-2 text-justify text-sm">{progress.description}</p>
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
                                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold dark:text-black">
                                        {`${progress.percentage}%`}
                                    </span>
                                </div>
                                <span className="w-8 text-sm font-medium">
                                    {progress.read?.book?.pageCount}
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="mt-2 flex h-36 flex-col items-center justify-center rounded-md border bg-white text-center transition-colors dark:bg-dark">
                    <h2 className="text-base font-semibold text-black dark:text-white">
                        Nenhum progresso recente.
                    </h2>
                    <p className="mt-2 w-[26rem] text-sm leading-6 text-muted-foreground">
                        {isCurrentUser ? (
                            <span>
                                Você ainda não fez nenhum progresso de leitura, que tal dar uma
                                olhada em nossa
                                <Link
                                    href="/livros"
                                    className="ml-1 font-medium text-black underline dark:text-white"
                                >
                                    lista de recomendações
                                </Link>
                            </span>
                        ) : (
                            `${username} ainda não tem nenhum progresso de leitura.`
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}
