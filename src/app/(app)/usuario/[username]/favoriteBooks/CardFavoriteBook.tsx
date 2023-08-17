import { FileText, ImageIcon, MoreVertical } from "lucide-react";
import Image from "next/image";

import { BookData } from "@/app/(app)/livros/[id]/page";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { LinkUnderline } from "@/components/LinkUnderline";
import { publishDateFormat } from "@/utils/publish-date-format";
import Link from "next/link";

interface CardFavoriteBookProps {
    currentBook: BookData;

    showMenu?: boolean;
    order?: number;
    openFavoriteBookDialog?: (order: number, isFavoriteBookFilled: boolean) => void;
    removeFavoriteBook?: (order: number) => void;
}

export function CardFavoriteBook({
    currentBook,

    showMenu,
    order,
    openFavoriteBookDialog,
    removeFavoriteBook,
}: CardFavoriteBookProps) {
    return (
        <div className="flex h-28 w-full items-start gap-4 rounded-md border bg-white/80 px-4 py-3">
            <div className="h-[5.6rem] w-16 overflow-hidden rounded-sm">
                {currentBook.imageUrl ? (
                    <Link href={`/livros/${currentBook.id}`}>
                        <Image
                            src={currentBook.imageUrl}
                            alt={`Capa do livro ${currentBook.title}`}
                            width={64}
                            height={90}
                            quality={100}
                            className="w-full overflow-hidden"
                        />
                    </Link>
                ) : (
                    <div className="flex h-full items-center justify-center rounded-sm border border-zinc-500">
                        <ImageIcon size={20} className="text-zinc-500" />
                    </div>
                )}
            </div>

            <div className="flex h-full w-full flex-1 flex-col justify-between gap-2">
                <div className="flex w-full items-start justify-between gap-2">
                    <div>
                        <LinkUnderline href={`/livros/${currentBook.id}`}>
                            <h3
                                className="font-semibold leading-none tracking-tight"
                                title={currentBook.title}
                            >
                                {currentBook.title}
                            </h3>
                        </LinkUnderline>
                        <span className="text-sm text-zinc-500">{currentBook.authors?.[0]}</span>
                    </div>
                    {showMenu && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon-sm" variant="default">
                                    <MoreVertical size={16} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => openFavoriteBookDialog?.(order as number, true)}
                                >
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => removeFavoriteBook?.(order as number)}
                                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                >
                                    Remover
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-zinc-500">
                            Publicado em {publishDateFormat(currentBook.publishDate)}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <FileText size={14} className="text-zinc-500" />
                        <span className="text-sm text-zinc-500">{currentBook.pageCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
