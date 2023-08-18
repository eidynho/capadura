"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { toast } from "react-toastify";

import { useDebounce } from "@/hooks/useDebounce";
import { useDidMountEffect } from "@/hooks/useDidMountEffect";

import { BookSearchItem } from "./BookSearchItem";
import { Button } from "./ui/Button";
import {
    Command,
    CommandDialog,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/Command";
import { fetchGoogleBooks } from "@/utils/fetch-google-books";

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
    const debouncedSearchName = useDebounce<string>(searchName, 400);

    useEffect(() => {
        const ctrlKShortcut = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", ctrlKShortcut);
        return () => document.removeEventListener("keydown", ctrlKShortcut);
    }, []);

    useEffect(() => {
        setSearchName("");
    }, [isOpen]);

    useDidMountEffect(() => {
        if (!searchName) return;

        setIsFetchingBooks(true);
    }, [searchName]);

    useDidMountEffect(() => {
        if (!debouncedSearchName) return;

        const getBooks = async () => {
            try {
                setIsFetchingBooks(true);

                const { data } = await fetchGoogleBooks(debouncedSearchName);

                const filteredItems = data.items?.filter((item) => {
                    const { authors, description, imageLinks } = item.volumeInfo;
                    return authors?.length && description && imageLinks;
                });

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
            <Button
                size="sm"
                variant="outline"
                onClick={() => setIsOpen(true)}
                className="relative h-[42px] w-56 justify-start pl-2 text-sm text-muted-foreground sm:pr-12"
            >
                <Search size={18} />
                <span>Procurar livro...</span>

                <kbd className="pointer-events-none absolute right-1.5 top-2.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
                    Ctrl + K
                </kbd>
            </Button>

            <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Busque por título, autor, editora, ISBN..."
                        onValueChange={(value) => setSearchName(value)}
                        value={searchName}
                    />
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
                                {!!searchName && !!books?.items?.length
                                    ? books.items.map((book) => (
                                          <CommandItem>
                                              <Link
                                                  href={`/livros/${book.id}`}
                                                  onClick={() => setIsOpen(false)}
                                                  key={book.id}
                                                  className="flex gap-4"
                                              >
                                                  <BookSearchItem book={book} />
                                              </Link>
                                          </CommandItem>
                                      ))
                                    : !!searchName && (
                                          <div className="flex h-36 flex-col items-center justify-center text-center">
                                              <h2 className="text-base font-semibold">
                                                  Nenhum resultado encontrado.
                                              </h2>
                                              <p className="mt-2 w-[26rem] text-sm leading-6 text-slate-600">
                                                  Não encontramos nenhum item com esse termo, tente
                                                  procurar algo diferente.
                                              </p>
                                          </div>
                                      )}
                            </>
                        )}
                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    );
}
