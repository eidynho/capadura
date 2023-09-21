import Link from "next/link";
import Image from "next/image";
import { FileText, ImageIcon, MoreVertical } from "lucide-react";

import { BookData } from "@/app/(app)/livros/[id]/page";

import { publishDateFormat } from "@/utils/publish-date-format";

import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { LinkUnderline } from "@/components/LinkUnderline";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

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
        <div className="flex h-28 w-full items-start gap-4 rounded-md border bg-white bg-opacity-80 px-4 py-3 transition-colors dark:bg-dark">
            <div className="h-[5.6rem] w-16 overflow-hidden rounded-sm">
                {currentBook.imageUrl ? (
                    <Link href={`/livros/${currentBook.id}`}>
                        <Image
                            src={currentBook.imageUrl}
                            width={64}
                            height={90}
                            loading="eager"
                            quality={100}
                            alt={`Capa do livro ${currentBook.title}`}
                            title={`Capa do livro ${currentBook.title}`}
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
                    <div>
                        <LinkUnderline href={`/livros/${currentBook.id}`} className="table">
                            <h3
                                className="font-semibold leading-none tracking-tight text-black dark:text-white"
                                title={currentBook.title}
                            >
                                {currentBook.title}
                            </h3>
                        </LinkUnderline>
                        <span className="text-sm text-muted-foreground">
                            {currentBook.authors?.[0]}
                        </span>
                    </div>
                    {showMenu && (
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
                        <span className="text-sm text-muted-foreground">
                            Publicado em {publishDateFormat(currentBook.publishDate)}
                        </span>
                    </div>

                    <TooltipProvider delayDuration={400} skipDelayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="flex cursor-default items-center gap-1">
                                    <FileText size={14} className="text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        {currentBook.pageCount}
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <span>Quantidade de páginas</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    );
}
