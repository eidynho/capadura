"use client";

import { useEffect, useState } from "react";
import { isValid, parse } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { BookDataFromGoogle, GoogleAPIData } from "@/components/ApplicationSearch";
import { BookData } from "@/app/(app)/livros/[id]/page";
import { useDebounce } from "@/hooks/useDebounce";
import { useDidMountEffect } from "@/hooks/useDidMountEffect";
import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";
import { fetchGoogleBooks } from "@/utils/fetch-google-books";

import { useFetchUserFavoriteBooks } from "@/endpoints/queries/favoriteBooksQueries";
import {
    useCreateFavoriteBook,
    useRemoveFavoriteBook,
    useUpdateFavoriteBook,
} from "@/endpoints/mutations/favoriteBooksMutations";

import { BookSearchItem } from "@/components/BookSearchItem";
import { Button } from "@/components/ui/Button";
import { CardFavoriteBook } from "./CardFavoriteBook";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/Command";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";

interface FavoriteBooksProps {
    username: string;
}

export function FavoriteBooks({ username }: FavoriteBooksProps) {
    const [isOpen, setIsOpen] = useState(false);

    // const [isLoading, setIsLoading] = useState(false);
    const [isFetchingBooks, setIsFetchingBooks] = useState(false);

    const [currentBook, setCurrentBook] = useState<BookData | null>(null);
    const [currentOrderPosition, setCurrentOrderPosition] = useState(0);
    const [books, setBooks] = useState<GoogleAPIData>({
        items: [],
        totalItems: 0,
    });

    const [searchName, setSearchName] = useState("");
    const debouncedSearchName = useDebounce<string>(searchName, 400);

    const isCurrentUser = isPageUserSameCurrentUser(username);

    const { data: favoriteBooks, isFetched } = useFetchUserFavoriteBooks({
        username,
        enabled: !!username,
    });

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
        if (!isCurrentUser || favoriteBooks === undefined) return;

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

    const createFavoriteBook = useCreateFavoriteBook();
    const updateFavoriteBook = useUpdateFavoriteBook();
    const isLoading = createFavoriteBook.isLoading || updateFavoriteBook.isLoading;

    async function saveFavoriteBook() {
        if (isLoading || !isCurrentUser || !currentBook?.id || favoriteBooks === undefined) return;

        const params = {
            username,
            order: currentOrderPosition,
            bookId: currentBook.id,
        };

        const favoriteBookWithSameOrder = favoriteBooks.find(
            (item) => item?.order === currentOrderPosition,
        );

        if (favoriteBookWithSameOrder) {
            updateFavoriteBook.mutate(
                {
                    ...params,
                    favoriteBookId: favoriteBookWithSameOrder.id,
                },
                {
                    onSuccess: () => setIsOpen(false),
                },
            );
        } else {
            createFavoriteBook.mutate(params, {
                onSuccess: () => setIsOpen(false),
            });
        }
    }

    const removeFavoriteBook = useRemoveFavoriteBook();
    function handleRemoveFavoriteBook(order: number) {
        if (favoriteBooks === undefined) return;

        const index = order - 1;
        const bookToRemove = favoriteBooks[index];

        if (isLoading || !isCurrentUser || !bookToRemove) return;

        removeFavoriteBook.mutate({
            username,
            indexToRemove: index,
            bookIdToRemove: bookToRemove.id,
        });
    }

    if (!isFetched || favoriteBooks === undefined) return;

    const noFavoriteBook = favoriteBooks.every((item) => item === null);

    return (
        <>
            <div className="flex flex-col">
                <h3 className="font-semibold text-black dark:text-white">Livros favoritos</h3>

                {!isCurrentUser && noFavoriteBook && (
                    <div className="mt-2 flex h-36 w-full flex-col items-center justify-center rounded-md border bg-white text-center">
                        <h2 className="text-base font-semibold">Nenhum livro favorito.</h2>
                        <p className="mt-2 w-[26rem] text-sm leading-6 text-muted-foreground">
                            {username} ainda não favoritou seus livros de cabeceira.
                        </p>
                    </div>
                )}

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
                                    removeFavoriteBook={handleRemoveFavoriteBook}
                                />
                            ) : (
                                isCurrentUser && (
                                    <div
                                        className="flex h-28 w-full cursor-pointer items-center justify-center rounded-md border border-dashed bg-white bg-opacity-80 px-3 py-2 transition-colors dark:bg-dark"
                                        onClick={() => openFavoriteBookDialog(index + 1)}
                                    >
                                        <span className="text-sm font-medium text-black dark:text-white">
                                            Adicionar livro
                                        </span>
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
                                                            <p className="mt-2 w-[26rem] text-sm leading-6 text-muted-foreground">
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
                                    <div className="flex h-28 w-full items-center justify-center rounded-md border border-dashed border-muted-foreground bg-white bg-opacity-80 px-3 py-2 dark:bg-dark">
                                        <span className="text-sm font-medium text-muted-foreground">
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
