"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Search } from "lucide-react";
import { toast } from "react-toastify";

import { useDebounce } from "@/hooks/useDebounce";
import useDidMountEffect from "@/hooks/useDidMountEffect";

import { BookSearchItem } from "./BookSearchItem";
import { Button } from "./ui/Button";
import {
    Command,
    CommandEmpty,
    CommandDialog,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/Command";

export interface BookDataFromGoogle {
    kind: string;
    id: string;
    etag: string;
    selfLink: string;
    volumeInfo: {
        title: string;
        subtitle: string;
        authors: string[];
        publisher: string;
        publishedDate: string;
        description: string;
        industryIdentifiers: {
            type: string;
            identifier: string;
        }[];
        pageCount: number;
        categories: string[];
        averageRating?: number;
        ratingsCount?: number;
        maturityRating: string;
        imageLinks?: {
            smallThumbnail?: string;
            thumbnail?: string;
            small?: string;
            medium?: string;
            large?: string;
            extraLarge?: string;
        };
        language: string;
    };
    searchInfo: {
        textSnippet: string;
    };
}

export interface GoogleAPIData {
    items: BookDataFromGoogle[];
    totalItems: number;
}

export function ApplicationSearch() {
    const [books, setBooks] = useState<GoogleAPIData>({
        items: [],
        totalItems: 0,
    });
    const [isFetchingBooks, setIsFetchingBooks] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchName, setSearchName] = useState("");
    const debouncedSearchName = useDebounce<string>(searchName, 200);

    useDidMountEffect(() => {
        if (!debouncedSearchName) {
            setIsOpen(false);
            return;
        }

        const getBooks = async () => {
            setIsOpen(true);
            setIsFetchingBooks(true);
            try {
                const query = [];

                query.push("q=" + `"${debouncedSearchName}"`);
                query.push("langRestrict=" + "pt-BR");
                query.push("maxResults=" + 8);
                query.push("startIndex=" + 0);
                query.push("orderBy=" + "relevance");
                query.push("printType=" + "books");

                const { data } = await axios.get<GoogleAPIData>(
                    `https://www.googleapis.com/books/v1/volumes?${query.join("&")}`,
                );

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

    return (
        <>
            <Button size="icon" variant="default" onClick={() => setIsOpen(true)}>
                <Search size={18} />
            </Button>

            <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Busque por título, autor, editora, ISBN..."
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
                                                <Link
                                                    href={`/livros/${book.id}`}
                                                    onClick={() => setSearchName("")}
                                                    key={book.id}
                                                    className="flex cursor-pointer gap-4 px-4 py-2 hover:bg-black hover:text-white"
                                                >
                                                    <BookSearchItem book={book} />
                                                </Link>
                                            </CommandItem>
                                        ))
                                    ) : (
                                        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                                    )}
                                </>
                            )}
                        </CommandList>
                    )}
                </Command>
            </CommandDialog>

            {/* <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search size={18} />
                </div>

                <Input
                    type="text"
                    id="nav-search"
                    onChange={(e) => setSearchName(e.target.value)}
                    value={searchName}
                    maxLength={240}
                    placeholder="Busque por título, autor, editora, ISBN..."
                    className="w-full pl-10 pr-10"
                />
                {searchName && (
                    <div
                        className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                        onClick={() => setSearchName("")}
                    >
                        <X size={18} />
                    </div>
                )}

                {debouncedSearchName && (
                    <div className="absolute left-0 top-10 z-10 w-[32rem] rounded-b-lg border border-black bg-white pb-2 pt-3 text-black">
                        {isLoadingBooks ? (
                            [...Array(3)].map((_, index) => (
                                <div
                                    key={index}
                                    className="mb-3 flex animate-pulse items-center gap-4"
                                >
                                    <div className="mx-3 h-16 w-12 rounded-lg bg-gray-200"></div>
                                    <div className="flex flex-col gap-2">
                                        <div className="h-4 w-32 rounded-lg bg-gray-200"></div>
                                        <div className="h-4 w-48 rounded-lg bg-gray-200"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                {books.items && books.items.length ? (
                                    <>
                                        <h2 className="mb-2 px-4 text-xl font-medium">Livros</h2>
                                        <div className="flex flex-col">
                                            {books.items.map((book) => (
                                                <>
                                                    {isLink ? (
                                                        <Link
                                                            href={`/livros/${book.id}`}
                                                            onClick={() => setSearchName("")}
                                                            key={book.id}
                                                            className="flex cursor-pointer gap-4 px-4 py-2 hover:bg-black hover:text-white"
                                                        >
                                                            <BookSearchItem book={book} />
                                                        </Link>
                                                    ) : (
                                                        <div
                                                            onClick={() =>
                                                                handleAddUserFavoriteBook(book)
                                                            }
                                                            key={book.id}
                                                            className="flex cursor-pointer gap-4 px-4 py-2 hover:bg-black hover:text-white"
                                                        >
                                                            <BookSearchItem book={book} />
                                                        </div>
                                                    )}
                                                </>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <span className="inline-block px-4 pb-2">
                                        Nenhum resultado encontrado.
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div> */}
        </>
    );
}
