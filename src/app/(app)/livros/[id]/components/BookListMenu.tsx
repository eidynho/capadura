"use client";

import { useContext, useEffect, useState } from "react";
import { ChevronDown, Check, List } from "lucide-react";
import { toast } from "react-toastify";

import { api } from "@/lib/api";
import { BookData } from "../page";
import { AuthContext } from "@/contexts/AuthContext";

import { BookListData, BookOnBookList } from "@/app/(app)/usuario/[username]/listas/page";

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
    const { user } = useContext(AuthContext);

    const [isOpen, setIsOpen] = useState(false);
    const [bookLists, setBookLists] = useState<BookListData[] | null>(null);

    useEffect(() => {
        async function getUserBookList() {
            if (!user) return;

            try {
                const { data } = await api.get<BookListData[]>(
                    `/booklists/user/${user.id}?bookId=${bookData.id}`,
                );

                setBookLists(data);
            } catch (err) {
                toast.error("Erro ao buscar listas.");
            }
        }
        getUserBookList();
    }, [isOpen]);

    async function createBookList() {
        try {
            const countBookLists = bookLists?.length || 0;

            const { data } = await api.post("/booklists", {
                name: `Lista ${countBookLists + 1}`,
            });

            setBookLists((prev) => {
                if (!prev) return null;

                const updatedBookList = [...prev];
                updatedBookList.unshift(data);

                return updatedBookList;
            });
        } catch (err) {
            toast.error("Erro ao criar lista.");
        }
    }

    async function toggleBookIntoBookList(bookList: BookListData, bookOnBookList?: BookOnBookList) {
        try {
            if (!!bookOnBookList) {
                await api.delete(`/books-on-booklists/${bookOnBookList.id}`);

                setBookLists((prev) => {
                    if (!prev) return null;

                    const updatedBookList = [...prev];
                    const bookListToUpdate = updatedBookList.find(
                        (item) => item.id === bookList.id,
                    );

                    if (!bookListToUpdate) return updatedBookList;

                    const bookOnBookList = bookListToUpdate.books.find(
                        (item) => item.bookId === bookData.id,
                    );

                    if (bookOnBookList) {
                        bookListToUpdate.books = bookListToUpdate.books.filter(
                            (item) => item.bookId !== bookData.id,
                        );
                    }

                    return updatedBookList;
                });
            } else {
                const { data } = await api.post<BookOnBookList>("/books-on-booklists", {
                    bookId: bookData.id,
                    bookListId: bookList.id,
                });

                setBookLists((prev) => {
                    if (!prev) return null;

                    const updatedBookList = [...prev];
                    const bookListToUpdate = updatedBookList.find(
                        (item) => item.id === bookList.id,
                    );

                    if (!bookListToUpdate) return updatedBookList;

                    if (!bookListToUpdate.books) {
                        bookListToUpdate.books = [];
                    }

                    bookListToUpdate.books.unshift(data);

                    return updatedBookList;
                });
            }
        } catch (err) {
            toast.error("Erro ao criar lista.");
        }
    }

    function renderBookLists() {
        return (
            <>
                {bookLists?.length ? (
                    bookLists.map((bookList) => {
                        const bookOnBookList = bookList.books?.find(
                            (bookOnBookList) => bookOnBookList.bookId === bookData.id,
                        );
                        return (
                            <DropdownMenuItem
                                key={bookList.id}
                                onClick={() => toggleBookIntoBookList(bookList, bookOnBookList)}
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
                    <div className="mx-5">
                        <span>Nenhuma lista encontrada.</span>
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
                    <ChevronDown size={14} className="text-zinc-500" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-72 w-56 overflow-auto">
                <DropdownMenuItem onClick={createBookList} className="pl-6 focus:bg-green-500/20">
                    Criar lista
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {renderBookLists()}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
