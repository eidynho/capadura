"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { Library, MoreHorizontal, PlusCircle } from "lucide-react";

import { api } from "@/lib/api";
import { ProfileData } from "@/contexts/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { BookData } from "@/app/(app)/livros/[id]/page";
import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";

import Loading from "./loading";

import { Container } from "@/components/layout/Container";
import { Title } from "@/components/Title";
import { Subtitle } from "@/components/Subtitle";
import { Button } from "@/components/ui/Button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Separator } from "@/components/ui/Separator";
import { UserHoverCard } from "@/components/UserHoverCard";
import { UpdateBookListDialog } from "./UpdateBookListDialog";
import { DeleteBookListDialog } from "./DeleteBookListDialog";
import { useDidMountEffect } from "@/hooks/useDidMountEffect";

export interface BookOnBookList {
    id: string;
    bookId: string;
    bookListId: string;
}

export type BookOnBookListWithBook = BookOnBookList & {
    book: BookData;
};

export interface BookListData {
    id: string;
    name: string;
    description: string;
    imageKey?: string;
    imageUrl?: string;
    books: { id: string; bookId: string; bookListId: string }[];
}

export default function UserLists() {
    const routePathname = usePathname();
    const username = routePathname.split("/")[2];

    const [isMounted, setIsMounted] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [user, setUser] = useState<ProfileData | null>(null);
    const [currentList, setCurrentList] = useState(0);
    const [booksOnBookList, setBooksOnBookList] = useState<BookOnBookListWithBook[] | null>(null);
    const [bookLists, setBookLists] = useState<BookListData[] | null>(null);

    const [searchName, setSearchName] = useState("");
    const debouncedSearchName = useDebounce<string>(searchName, 400);

    const isCurrentUser = isPageUserSameCurrentUser(username);

    useEffect(() => {
        async function getUserBookList() {
            if (!username) return;

            setIsFetching(true);

            try {
                const userResponse = await api.get(`/users/${username}`);
                const userId = userResponse.data.id;
                setUser(userResponse.data);

                let query = "";
                if (debouncedSearchName.trim()) {
                    query = `?q=${debouncedSearchName.trim()}`;
                }

                const { data } = await api.get<BookListData[]>(`/booklists/user/${userId}${query}`);
                setBookLists(data);
            } catch (err) {
                toast.error("Não foi possível buscar listas.");
            } finally {
                setIsFetching(false);
            }
        }
        getUserBookList();
    }, [username, debouncedSearchName]);

    useDidMountEffect(() => {
        if (!searchName) return;

        setIsFetching(true);
    }, [searchName]);

    useEffect(() => {
        async function getBooksOfList() {
            if (!bookLists) return;

            const bookListId = bookLists[currentList]?.id;

            setIsFetching(true);

            try {
                const { data } = await api.get<BookOnBookListWithBook[]>(
                    `/books-on-booklists/bookList/${bookListId}`,
                );

                setBooksOnBookList(data);
            } catch (err) {
                toast.error("Não foi possível buscar livros.");
            } finally {
                setIsFetching(false);
            }
        }
        getBooksOfList();
    }, [username, bookLists, currentList]);

    async function createBookList() {
        if (!isCurrentUser) return;

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

    async function deleteBookOnBookList(bookOnBookListId: string) {
        if (!isCurrentUser) return;

        try {
            await api.delete(`/books-on-booklists/${bookOnBookListId}`);

            setBooksOnBookList((prev) => {
                if (!prev) return null;

                const updatedBooksOnBookList = [...prev];
                return updatedBooksOnBookList.filter((books) => books.id !== bookOnBookListId);
            });
        } catch (err) {
            toast.error("Erro ao criar lista.");
        }
    }

    // render loading
    // if (!isMounted) {
    //     return <Loading />;
    // }

    function renderBookLists() {
        return (
            <>
                {bookLists?.length ? (
                    <nav className="flex flex-col gap-1">
                        {bookLists.map((bookList, index) => {
                            return (
                                <div
                                    key={bookList.id}
                                    onClick={() => setCurrentList(index)}
                                    className={`${
                                        currentList === index
                                            ? "border border-black bg-black text-white"
                                            : "border border-transparent hover:bg-black hover:bg-opacity-5"
                                    } cursor-pointer rounded-md px-4 py-2 text-sm`}
                                >
                                    <span className="block w-full truncate">{bookList.name}</span>
                                </div>
                            );
                        })}
                    </nav>
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
        <Container>
            <Title>{isCurrentUser ? "Minhas listas" : `Listas do ${username}`}</Title>
            {isCurrentUser && <Subtitle>Organize sua leitura do jeito que você quiser.</Subtitle>}

            <Separator className="my-6 bg-gray-300" />

            <div className="mt-4 flex flex-col gap-8 md:flex-row lg:gap-6 xl:gap-8">
                <div className="w-full md:w-1/4">
                    {isCurrentUser && (
                        <>
                            <Button variant="default" onClick={createBookList}>
                                <PlusCircle size={18} />
                                Nova lista
                            </Button>

                            <Separator className="my-6 bg-black" />
                        </>
                    )}
                    {renderBookLists()}
                </div>

                {bookLists?.[currentList] ? (
                    <div className="flex w-full flex-col gap-8 md:w-3/4">
                        <div className="flex gap-4">
                            <div className="flex h-56 w-56 rounded-md bg-neutral-800 transition-all">
                                {bookLists[currentList].imageUrl ? (
                                    <Image
                                        src={bookLists[currentList].imageUrl as string}
                                        alt=""
                                        width={224}
                                        height={224}
                                        className="rounded-md"
                                    />
                                ) : (
                                    <div className="flex h-56 w-56 items-center justify-center rounded-md text-white">
                                        <Library size={32} />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-1 flex-col justify-between gap-3">
                                <div>
                                    <div className="flex items-center justify-between gap-2">
                                        <h2 className="flex-1 text-xl font-medium leading-relaxed tracking-tight">
                                            {bookLists[currentList].name}
                                        </h2>

                                        {isCurrentUser && (
                                            <>
                                                <UpdateBookListDialog
                                                    currentList={currentList}
                                                    bookLists={bookLists}
                                                    setBookLists={setBookLists}
                                                />

                                                <DeleteBookListDialog
                                                    bookListId={bookLists[currentList].id}
                                                    setBookLists={setBookLists}
                                                />
                                            </>
                                        )}
                                    </div>
                                    <p className="mt-2 text-zinc-500">
                                        {bookLists[currentList].description}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    {user && <UserHoverCard user={user} />}
                                    <span className="mr-2">•</span>
                                    <span className="text-sm font-medium">
                                        {!booksOnBookList?.length
                                            ? "Nenhum livro"
                                            : booksOnBookList.length === 1
                                            ? "1 livro"
                                            : `${booksOnBookList.length} livros`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {booksOnBookList?.length ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">#</TableHead>
                                        <TableHead className="hover:bg-gray-200">Nome</TableHead>
                                        <TableHead>Autor(a)</TableHead>
                                        <TableHead>Ano de publicação</TableHead>
                                        <TableHead>Páginas</TableHead>
                                        <TableHead className="text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {booksOnBookList?.map((bookOnBookList, index) => (
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>{bookOnBookList.book.title}</TableCell>
                                            <TableCell>{bookOnBookList.book.authors[0]}</TableCell>
                                            <TableCell>{`${bookOnBookList.book.publishDate}`}</TableCell>
                                            <TableCell>{bookOnBookList.book.pageCount}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="default"
                                                            className="flex h-8 w-8 p-0 data-[state=open]:bg-gray-200"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Abrir menu
                                                            </span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-[160px]"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                deleteBookOnBookList(
                                                                    bookOnBookList.id,
                                                                )
                                                            }
                                                        >
                                                            Deletar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <span className="font-medium">A lista ainda não possui livros.</span>
                        )}
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </Container>
    );
}
