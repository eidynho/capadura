import Link from "next/link";
import Image from "next/image";
import { FileText, ImageIcon, MoreVertical } from "lucide-react";

import { BookData } from "@/endpoints/queries/booksQueries";

import { publishDateFormat } from "@/utils/publish-date-format";

import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
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
                            unoptimized
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
                    <div className="flex flex-col gap-1">
                        <Link
                            href={`/livros/${currentBook.id}`}
                            className="font-semibold leading-none tracking-tight text-black hover:underline dark:text-white"
                        >
                            {currentBook.title}
                        </Link>
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
                    <TooltipProvider delayDuration={400} skipDelayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger>
                                <span className="cursor-default text-sm text-muted-foreground">
                                    {publishDateFormat(currentBook.publishDate)}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <span>Ano de publicação</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

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
