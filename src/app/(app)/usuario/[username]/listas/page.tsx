"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { MoreHorizontal, PlusCircle } from "lucide-react";

import { api } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { BookData } from "@/app/(app)/livros/[id]/page";
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

export interface BookOnBookList {
    id: string;
    bookId: string;
    bookListId: string;
}

type BookOnBookListWithBook = BookOnBookList & {
    book: BookData;
};

export interface BookListData {
    id: string;
    name: string;
    description: string;
    books: { id: string; bookId: string; bookListId: string }[];
}

export default function UserLists() {
    const routePathname = usePathname();
    const username = routePathname.split("/")[routePathname.split("/").length - 2];

    const [isMounted, setIsMounted] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [currentList, setCurrentList] = useState(0);
    const [booksOnBookList, setBooksOnBookList] = useState<BookOnBookListWithBook[] | null>(null);
    const [bookLists, setBookLists] = useState<BookListData[] | null>(null);

    const [searchName, setSearchName] = useState("");

    const debouncedSearchName = useDebounce<string>(searchName, 400);

    useEffect(() => {
        async function getUserBookList() {
            if (!username) return;

            setIsFetching(true);

            try {
                const userResponse = await api.get(`/users/${username}`);
                const userId = userResponse.data.id;

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
    }, [debouncedSearchName]);

    useEffect(() => {
        async function getBooksOfList() {
            if (!bookLists) return;

            const bookListId = bookLists[currentList].id;

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
    }, [bookLists, currentList]);

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

    async function deleteBookOnBookList(bookOnBookListId: string) {
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
                                    } cursor-pointer rounded-lg px-4 py-2 text-sm`}
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

    // render loading
    // if (!isMounted) {
    //     return <Loading />;
    // }

    return (
        <Container>
            <Title>Minhas listas</Title>
            <Subtitle>Organize sua leitura do jeito que você quiser.</Subtitle>

            <Separator className="my-6 bg-gray-300" />

            <div className="mt-4 flex flex-col gap-8 md:flex-row lg:gap-6 xl:gap-8">
                <div className="w-full md:w-1/4">
                    <Button variant="default" onClick={createBookList}>
                        <PlusCircle size={18} />
                        Criar lista
                    </Button>

                    <Separator className="my-6 bg-black" />
                    {renderBookLists()}
                </div>

                <div className="flex w-full flex-col gap-8 md:w-3/4">
                    <div className="flex gap-4">
                        <div className="h-44 w-44 rounded-md border border-black"></div>
                        <div className="flex flex-1 flex-col gap-3">
                            <h2 className="text-xl font-medium leading-relaxed tracking-tight">
                                {bookLists?.[currentList].name}
                            </h2>
                            <p className="text-muted-foreground">
                                {bookLists?.[currentList].description}
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo,
                                provident maxime in a doloremque odit repellat, consectetur
                                voluptatibus cum repellendus, mollitia accusamus quisquam tenetur!
                                Delectus laboriosam obcaecati reprehenderit consequuntur illum.
                            </p>
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
                                        <TableCell className="font-medium">{index + 1}</TableCell>
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
                                                        <span className="sr-only">Abrir menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-[160px]"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            deleteBookOnBookList(bookOnBookList.id)
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
            </div>
        </Container>
    );
}
