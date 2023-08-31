import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";

import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";
import { ReadData } from "@/app/(app)/livros/[id]/page";

import { LinkUnderline } from "@/components/LinkUnderline";
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
        <div className="flex flex-col">
            <h3 className="font-semibold">Leituras finalizadas</h3>

            {!!readsData.items?.length ? (
                readsData.items.map((read) => (
                    <div className="flex gap-4 border-t border-black/20 py-4 last:border-b">
                        <div className="h-28 w-20 rounded-md border border-black"></div>
                        <div className="w-full">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <LinkUnderline
                                        href={`/livros/${read.bookId}`}
                                        className="font-semibold"
                                    >
                                        {read.book?.title}
                                    </LinkUnderline>
                                </div>
                            </div>

                            <div className="flex items-center">
                                {!!read.reviewRating && <RatingStars rating={read.reviewRating} />}

                                {read.endDate && (
                                    <div className="ml-3 flex items-center gap-1">
                                        <span className="text-sm font-medium">Finalizado em</span>
                                        <span className="mt-[2px] text-xs font-semibold text-gray-500">
                                            {format(
                                                parseISO(read?.endDate.toString()),
                                                "dd/MM/yyyy",
                                                { locale: pt },
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {read?.reviewContent && (
                                <p className="mt-2 text-justify text-sm">{read?.reviewContent}</p>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="mt-2 flex h-36 flex-col items-center justify-center rounded-md border bg-white text-center">
                    <h2 className="text-base font-semibold">Nenhuma leitura finalizada.</h2>
                    <p className="mt-2 w-[26rem] text-sm leading-6 text-slate-600">
                        {isCurrentUser
                            ? "Você ainda não terminou de ler um livro, vamos registar algum?"
                            : `${username} ainda não terminou de ler nenhum livro.`}
                    </p>
                </div>
            )}
        </div>
    );
}
