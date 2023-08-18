"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { api } from "@/lib/api";
import { BookDataFromGoogle, GoogleAPIData } from "@/components/ApplicationSearch";
import { BookData } from "@/app/(app)/livros/[id]/page";
import { useDebounce } from "@/hooks/useDebounce";
import { useDidMountEffect } from "@/hooks/useDidMountEffect";
import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";
import { fetchGoogleBooks } from "@/utils/fetch-google-books";

import { CardFavoriteBook } from "./CardFavoriteBook";
import { Button } from "@/components/ui/Button";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/Command";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { BookSearchItem } from "@/components/BookSearchItem";
import { isValid, parse } from "date-fns";

interface favoriteBooksData {
    id: string;
    order: number;
    bookId: string;
    book: BookData;
    updatedAt: Date | string;
    userId: string;
}

export function FavoriteBooks() {
    const routePathname = usePathname();
    const username = routePathname.split("/")[routePathname.split("/").length - 1];

    const [isOpen, setIsOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingBooks, setIsFetchingBooks] = useState(false);

    const [currentBook, setCurrentBook] = useState<BookData | null>(null);
    const [currentOrderPosition, setCurrentOrderPosition] = useState(0);
    const [books, setBooks] = useState<GoogleAPIData>({
        items: [],
        totalItems: 0,
    });
    const [favoriteBooks, setFavoriteBooks] = useState<(favoriteBooksData | null)[]>([
        null,
        null,
        null,
        null,
    ]);

    const [searchName, setSearchName] = useState("");
    const debouncedSearchName = useDebounce<string>(searchName, 400);

    const isCurrentUser = isPageUserSameCurrentUser(username);

    useEffect(() => {
        async function getUserFavoriteBooks() {
            const { data } = await api.get<favoriteBooksData[]>(`/favorite-books/user/${username}`);
            setFavoriteBooks((prev) => {
                const updatedFavoriteBooks = [...prev];

                data.forEach((item) => {
                    const index = item.order - 1;
                    updatedFavoriteBooks[index] = item;
                });

                return updatedFavoriteBooks;
            });
        }
        getUserFavoriteBooks();
    }, []);

    useEffect(() => {
        if (isOpen) return;

        setCurrentBook(null);
    }, [isOpen]);

    useDidMountEffect(() => {
        if (!searchName) return;

        setIsFetchingBooks(true);
    }, [searchName]);

    useDidMountEffect(() => {
        if (!debouncedSearchName) {
            return;
        }

        const getBooks = async () => {
            setIsFetchingBooks(true);
            try {
                const { data } = await fetchGoogleBooks(debouncedSearchName);

                const filteredItems = data.items?.filter(
                    (item) => item.volumeInfo.description && item.volumeInfo.imageLinks,
                );

                setBooks({
                    items: filteredItems,
                    totalItems: data.totalItems,
                });
            } catch (err) {
                toast.error("Erro ao carregar livros.");
                throw err;
            } finally {
                setIsFetchingBooks(false);
            }
        };
        getBooks();
    }, [debouncedSearchName]);

    function openFavoriteBookDialog(order: number, isFavoriteBookFilled = false) {
        if (!isCurrentUser) return;

        setIsOpen(true);
        setCurrentOrderPosition(order);

        if (isFavoriteBookFilled) {
            const index = order - 1;
            setCurrentBook(favoriteBooks[index]?.book as BookData);
        }
    }

    function updateCurrentBookWithGoogleBook(book: BookDataFromGoogle) {
        if (!book) return;

        const parsedDate = parse(book.volumeInfo.publishedDate, "yyyy-MM-dd", new Date());

        const bookParams: BookData = {
            id: book.id,
            imageUrl: book.volumeInfo.imageLinks?.thumbnail?.replace("edge=curl", ""),
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors,
            pageCount: book.volumeInfo.pageCount,
            publishDate: isValid(parsedDate) ? parsedDate : undefined,
        };

        setCurrentBook(bookParams);
        setSearchName("");
    }

    async function saveFavoriteBook() {
        if (isLoading || !isCurrentUser || !currentBook?.id) return;

        try {
            setIsLoading(true);

            const favoriteBookWithSameOrder = favoriteBooks.find(
                (item) => item?.order === currentOrderPosition,
            );

            const method = !!favoriteBookWithSameOrder ? "put" : "post";

            const { data } = await api[method]("/favorite-books", {
                favoriteBookId: method === "put" ? favoriteBookWithSameOrder?.id : undefined,
                order: currentOrderPosition,
                bookId: currentBook.id,
            });

            setFavoriteBooks((prev) => {
                const favoriteBookToUpdate = [...prev];

                const index = currentOrderPosition - 1;
                favoriteBookToUpdate[index] = data;

                return favoriteBookToUpdate;
            });

            toast.success("O livro favorito foi atualizado.");
            setIsOpen(false);
        } catch (err) {
            toast.error("Erro ao salvar o livro favorito.");
            throw new Error("Failed on save favorite book.");
        } finally {
            setIsLoading(false);
        }
    }

    async function removeFavoriteBook(order: number) {
        const index = order - 1;
        const bookToRemove = favoriteBooks[index];

        if (isLoading || !isCurrentUser || !bookToRemove) return;

        try {
            setIsLoading(true);

            await api.delete(`/favorite-books/${bookToRemove.id}`);

            setFavoriteBooks((prev) => {
                const favoriteBookToUpdate = [...prev];

                favoriteBookToUpdate[index] = null;

                return favoriteBookToUpdate;
            });

            toast.success("O livro favorito foi removido.");
        } catch (err) {
            toast.error("Erro ao remover o livro favorito.");
            throw new Error("Failed on remove favorite book.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="flex flex-col">
                <h3 className="font-semibold">Livros favoritos</h3>

                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {favoriteBooks.map((item, index) => (
                        <>
                            {item ? (
                                <CardFavoriteBook
                                    currentBook={{
                                        id: item.bookId,
                                        imageUrl: item.book.imageUrl,
                                        title: item.book.title,
                                        authors: item.book.authors,
                                        pageCount: item.book.pageCount,
                                        publishDate: item.book.publishDate,
                                    }}
                                    showMenu={isCurrentUser}
                                    order={index + 1}
                                    openFavoriteBookDialog={openFavoriteBookDialog}
                                    removeFavoriteBook={removeFavoriteBook}
                                />
                            ) : (
                                isCurrentUser && (
                                    <div
                                        className="flex h-28 w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-muted-foreground bg-white/80 px-3 py-2"
                                        onClick={() => openFavoriteBookDialog(index + 1)}
                                    >
                                        <span className="text-sm font-medium">Adicionar livro</span>
                                    </div>
                                )
                            )}
                        </>
                    ))}

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Adicionar livro favorito</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                Personalize seu perfil com seus livros favoritos.
                            </DialogDescription>

                            <div className="flex flex-col gap-6">
                                <Command shouldFilter={false}>
                                    <CommandInput
                                        placeholder="Buscar livro"
                                        onValueChange={(value) => setSearchName(value)}
                                        value={searchName}
                                    />
                                    {!!searchName && (
                                        <CommandList>
                                            {isFetchingBooks ? (
                                                <div className="flex h-28 w-full animate-pulse items-start gap-4 rounded-md border bg-white/80 px-4 py-3">
                                                    <div className="h-[5.6rem] w-16 rounded-sm bg-gray-200"></div>

                                                    <div className="flex h-full w-full flex-1 flex-col justify-between gap-2">
                                                        <div className="flex w-full items-start justify-between gap-2">
                                                            <div>
                                                                <div className="mb-1 h-6 w-24 rounded-sm bg-gray-200 font-semibold"></div>
                                                                <div className="h-5 w-36 rounded-sm bg-gray-200"></div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-6">
                                                            <div className="h-5 w-24 rounded-sm bg-gray-200"></div>

                                                            <div className="flex h-5 w-32 items-center gap-1 rounded-sm bg-gray-200"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {books?.items?.length ? (
                                                        books.items.map((book) => (
                                                            <CommandItem>
                                                                <div
                                                                    onClick={() =>
                                                                        updateCurrentBookWithGoogleBook(
                                                                            book,
                                                                        )
                                                                    }
                                                                    key={book.id}
                                                                    className="flex cursor-pointer gap-4 px-2 py-1"
                                                                >
                                                                    <BookSearchItem book={book} />
                                                                </div>
                                                            </CommandItem>
                                                        ))
                                                    ) : (
                                                        <div className="flex h-36 flex-col items-center justify-center text-center">
                                                            <h2 className="text-base font-semibold">
                                                                Nenhum resultado encontrado.
                                                            </h2>
                                                            <p className="mt-2 w-[26rem] text-sm leading-6 text-slate-600">
                                                                Não encontramos nenhum item com esse
                                                                termo, tente procurar algo
                                                                diferente.
                                                            </p>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </CommandList>
                                    )}
                                </Command>

                                {currentBook ? (
                                    <div className="pointer-events-none">
                                        <CardFavoriteBook currentBook={currentBook} />
                                    </div>
                                ) : (
                                    <div className="flex h-28 w-full items-center justify-center rounded-md border border-dashed border-muted-foreground bg-white/80 px-3 py-2">
                                        <span className="text-sm font-medium">
                                            Pré-visualização
                                        </span>
                                    </div>
                                )}

                                <Button
                                    size="sm"
                                    variant="success"
                                    type="submit"
                                    onClick={saveFavoriteBook}
                                    disabled={!currentBook}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={22} className="animate-spin" />
                                            <span>Salvando...</span>
                                        </>
                                    ) : (
                                        <span>Salvar</span>
                                    )}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    );
}
