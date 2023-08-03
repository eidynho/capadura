"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { Image as ImageIcon, MagnifyingGlass, User, X } from "phosphor-react";

import { api } from "@/lib/api";
import { ProfileData } from "@/contexts/AuthContext";
import { UserData } from "@/app/(app)/me/[username]/page";

import { useDebounce } from "@/hooks/useDebounce";
import useDidMountEffect from "@/hooks/useDidMountEffect";

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

interface ApplicationSearchProps {
    isLink: boolean;
    user?: ProfileData;
    setUserData?: Dispatch<SetStateAction<UserData>>;
    itemId?: number;
    executeOnSelect?: () => void;
}

export function ApplicationSearch({
    isLink,
    user,
    setUserData,
    itemId,
    executeOnSelect,
}: ApplicationSearchProps) {
    const [books, setBooks] = useState<GoogleAPIData>({
        items: [],
        totalItems: 0,
    });
    const [searchName, setSearchName] = useState("");
    const [isLoadingBooks, setIsLoadingBooks] = useState(false);
    const debouncedSearchName = useDebounce<string>(searchName, 500);

    useDidMountEffect(() => {
        if (!debouncedSearchName) return;

        const getBooks = async () => {
            setIsLoadingBooks(true);
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
                setIsLoadingBooks(false);
            }
        };
        getBooks();
    }, [debouncedSearchName]);

    async function handleAddUserFavoriteBook(book: BookDataFromGoogle) {
        if (!user || !setUserData || typeof itemId !== "number") return;

        try {
            const userCopy = { ...user };

            for (let i = 0; i <= 3; i++) {
                if (!userCopy.favoriteBooks[i]) {
                    userCopy.favoriteBooks[i] = "";
                }
            }

            userCopy.favoriteBooks[itemId] = book.id;
            const favoriteBooksRequestData = userCopy.favoriteBooks;

            await api.put("/me", {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                favoriteBooks: favoriteBooksRequestData,
            });

            setUserData((prev) => {
                const updatedUserData = { ...prev };
                const updatedUser = { ...prev.user };

                updatedUser.favoriteBooks[itemId] = book.id;
                updatedUserData.user = updatedUser;

                return updatedUserData;
            });

            toast.success("Seus livros favoritos foram atualizados.");
        } catch (err) {
            toast.error("Erro ao adicionar livro favorito.");
        }

        if (executeOnSelect) {
            executeOnSelect();
        }
    }

    function renderBookSearchItem(book: BookDataFromGoogle) {
        return (
            <>
                <div className="h-16 w-12 overflow-hidden rounded-lg border border-black">
                    {book.volumeInfo.imageLinks?.thumbnail ? (
                        <Image
                            src={book.volumeInfo.imageLinks?.thumbnail?.replace("edge=curl", "")}
                            alt=""
                            width={48}
                            height={64}
                            quality={75}
                            className="w-full overflow-hidden"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <ImageIcon size={42} weight="bold" className="text-gray-500" />
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="line-clamp-1" title={book.volumeInfo.title}>
                            {book.volumeInfo.title}
                        </h2>
                        <span className="text-xs text-gray-500">
                            {book.volumeInfo.publishedDate &&
                                book.volumeInfo.publishedDate.split("-")[0]}
                        </span>
                    </div>
                    <span className="flex items-center gap-2 text-sm">
                        <User size={18} />
                        {book.volumeInfo.authors?.[0]}
                    </span>
                </div>
            </>
        );
    }

    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlass size={18} />
            </div>
            <input
                type="text"
                id="nav-search"
                onChange={(e) => setSearchName(e.target.value)}
                value={searchName}
                maxLength={240}
                placeholder="Busque por título, autor, editora, ISBN..."
                className="block w-[32rem] rounded-lg border border-black py-3 pl-10 pr-10 text-sm outline-none focus:border-yellow-500"
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
                            <div key={index} className="mb-3 flex animate-pulse items-center gap-4">
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
                                                        href={`/books/${book.id}`}
                                                        onClick={() => setSearchName("")}
                                                        key={book.id}
                                                        className="flex cursor-pointer gap-4 px-4 py-2 hover:bg-black hover:text-white"
                                                    >
                                                        {renderBookSearchItem(book)}
                                                    </Link>
                                                ) : (
                                                    <div
                                                        onClick={() =>
                                                            handleAddUserFavoriteBook(book)
                                                        }
                                                        key={book.id}
                                                        className="flex cursor-pointer gap-4 px-4 py-2 hover:bg-black hover:text-white"
                                                    >
                                                        {renderBookSearchItem(book)}
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
        </div>
    );
}
