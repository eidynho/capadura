"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check, List, PlusCircle, CornerDownRight, BadgePlus } from "lucide-react";
import { toast } from "react-toastify";

import { api } from "@/lib/api";
import { BookData } from "../page";
import { useDebounce } from "@/hooks/useDebounce";
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
    const [isFetching, setIsFetching] = useState(true);
    const [bookLists, setBookLists] = useState<BookListData[] | null>(null);
    const [searchName, setSearchName] = useState("");

    const debouncedSearchName = useDebounce<string>(searchName, 400);

    useEffect(() => {
        async function getUserBookList() {
            if (!user) return;

            setIsFetching(true);

            try {
                const query = [];

                query.push("bookId=" + bookData.id);

                if (debouncedSearchName.trim()) {
                    query.push("q=" + debouncedSearchName.trim());
                }

                const { data } = await api.get<BookListData[]>(
                    `/booklists/user/${user.id}?${query.join("&")}`,
                );

                setBookLists(data);
            } catch (err) {
                toast.error("Erro ao buscar listas.");
            } finally {
                setIsFetching(false);
            }
        }
        getUserBookList();
    }, [isOpen, debouncedSearchName]);

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
                                                        strokeWidth={3}
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
                        {debouncedSearchName ? (
                            <span className="break-words">
                                Nenhuma lista com a busca "<strong>{debouncedSearchName}</strong>"
                                foi encontrada.
                            </span>
                        ) : (
                            <span>Nenhuma lista encontrada.</span>
                        )}
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
            <DropdownMenuContent className="max-h-72 w-52 overflow-auto">
                <DropdownMenuItem
                    onClick={createBookList}
                    className="cursor-pointer focus:bg-green-500/20"
                >
                    Criar lista
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {renderBookLists()}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
