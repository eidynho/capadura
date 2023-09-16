"use client";

import { useState } from "react";
import { ChevronDown, Check, List } from "lucide-react";
import { toast } from "react-toastify";

import { BookData } from "../page";
import { useAuthContext } from "@/contexts/AuthContext";

import { useFetchUserBookListsIncludeBook } from "@/endpoints/queries/bookListsQueries";
import { useCreateBookList } from "@/endpoints/mutations/bookListsMutations";
import {
    useAddBookToABookList,
    useRemoveBookFromBookList,
} from "@/endpoints/mutations/booksOnBookListMutations";

import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

interface BookListMenuProps {
    bookData: BookData;
}

export function BookListMenu({ bookData }: BookListMenuProps) {
    const { user } = useAuthContext();
    if (!user) return null;

    const [isOpen, setIsOpen] = useState(false);

    const { data: bookLists, isFetching } = useFetchUserBookListsIncludeBook({
        userId: user.id,
        bookId: bookData.id,
        enabled: isOpen,
    });

    const createBookList = useCreateBookList();
    function handleCreateBookList() {
        if (!user) {
            toast.error("Usuário não encontrado.");
            return;
        }

        createBookList.mutate({
            userId: user.id,
            name: `Lista - ${(bookLists?.length || 0) + 1}`,
        });
    }

    const addBookToABookList = useAddBookToABookList();
    function handleAddBookToABookList(bookListId: string) {
        if (!user) {
            toast.error("Usuário não encontrado.");
            return;
        }

        addBookToABookList.mutate({
            userId: user.id,
            bookId: bookData.id,
            bookListId: bookListId,
        });
    }

    const removeBookFromBookList = useRemoveBookFromBookList();
    function handleRemoveBookFromBookList(bookListId: string, bookOnBookListId: string) {
        if (!user) {
            toast.error("Usuário não encontrado.");
            return;
        }

        removeBookFromBookList.mutate({
            userId: user.id,
            bookId: bookData.id,
            bookListId: bookListId,
            bookOnBookListId,
        });
    }

    function renderBookLists() {
        return (
            <>
                {isFetching ? (
                    <div className="flex flex-col gap-1">
                        {Array.from({ length: 4 }, (_, index) => (
                            <div key={index} className="py-1 pl-6">
                                <div className="h-5 w-32 animate-pulse rounded-md bg-zinc-300 pl-6 dark:bg-accent"></div>
                            </div>
                        ))}
                    </div>
                ) : bookLists?.length ? (
                    bookLists.map((bookList) => {
                        const bookOnBookList = bookList.books?.find(
                            (bookOnBookList) => bookOnBookList.bookId === bookData.id,
                        );
                        return (
                            <DropdownMenuItem
                                key={bookList.id}
                                onClick={() =>
                                    bookOnBookList
                                        ? handleRemoveBookFromBookList(
                                              bookList.id,
                                              bookOnBookList.id,
                                          )
                                        : handleAddBookToABookList(bookList.id)
                                }
                                className="relative pl-6"
                            >
                                <span className="w-full truncate">{bookList.name}</span>

                                <TooltipProvider delayDuration={400} skipDelayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="absolute left-1 top-2">
                                                {bookOnBookList && (
                                                    <Check
                                                        size={14}
                                                        className="text-green-500"
                                                        strokeWidth={3.2}
                                                    />
                                                )}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <span>Já está na lista</span>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </DropdownMenuItem>
                        );
                    })
                ) : (
                    <div className="mx-5 py-4">
                        <span className="text-sm">Nenhuma lista encontrada.</span>
                    </div>
                )}
            </>
        );
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                    <List size={16} />
                    <span className="text-sm font-medium">Adicionar a lista</span>
                    <ChevronDown size={14} className="text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-72 w-56 overflow-auto">
                <DropdownMenuItem
                    onClick={handleCreateBookList}
                    className="pl-6 focus:bg-green-500/20"
                >
                    Criar lista
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {renderBookLists()}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
