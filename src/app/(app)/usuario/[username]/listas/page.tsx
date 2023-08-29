"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Library, MoreHorizontal, PlusCircle } from "lucide-react";

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
import { useFetchUserBookLists } from "@/endpoints/queries/bookListsQueries";
import { useFetchUserByUsername } from "@/endpoints/queries/usersQueries";
import { useFetchBooksOnBookList } from "@/endpoints/queries/booksOnBookListQueries";
import {
    useCreateBookList,
    useDeleteBookList,
    useUpdateBookList,
} from "@/endpoints/mutations/bookListsMutations";
import { useRemoveBookFromBookList } from "@/endpoints/mutations/booksOnBookListMutations";

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

interface UserListsProps {
    params: {
        username: string;
    };
}

export default function UserLists({ params }: UserListsProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [activeBookList, setActiveBookList] = useState(0);

    const isCurrentUser = isPageUserSameCurrentUser(params.username);

    const { data: targetUser, isError } = useFetchUserByUsername({
        username: params.username,
    });

    const { data: bookLists, isFetching: isFetchingUserBookLists } = useFetchUserBookLists({
        userId: targetUser?.id || "",
        enabled: !!targetUser?.id,
    });

    const { data: booksOnBookList, isFetching: isFetchingBooksOnBookList } =
        useFetchBooksOnBookList({
            bookListId: bookLists?.[activeBookList]?.id || "",
            enabled: !!bookLists?.[activeBookList]?.id,
        });

    const createBookList = useCreateBookList();
    function handleCreateBookList() {
        createBookList.mutate({
            userId: targetUser?.id || "",
            currentBooklistCount: bookLists?.length || 0,
        });
    }

    const updateBookList = useUpdateBookList();
    async function handleUpdateBookList(name: string, description?: string, image?: any) {
        if (!targetUser?.id || !bookLists) return;

        await updateBookList.mutateAsync({
            userId: targetUser.id,
            activeBookList,
            bookListId: bookLists[activeBookList].id,
            name,
            description,
            image,
        });
    }

    const deleteBookList = useDeleteBookList();
    async function handleDeleteBookList(bookListId: string) {
        if (!targetUser?.id) return;

        await deleteBookList.mutateAsync({
            userId: targetUser.id,
            bookListId,
        });
    }

    const removeBookFromBookList = useRemoveBookFromBookList();
    function handleRemoveBookFromBookList(bookOnBookList: BookOnBookList) {
        if (!targetUser?.id) return;

        const { id, bookId, bookListId } = bookOnBookList;

        removeBookFromBookList.mutate({
            userId: targetUser.id,
            bookOnBookListId: id,
            bookId: bookId,
            bookListId: bookListId,
        });
    }

    async function handleUpdateActiveBookList(index: number) {
        setActiveBookList(index);
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
                                    onClick={() => handleUpdateActiveBookList(index)}
                                    className={`${
                                        activeBookList === index
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
                        <span>Nenhuma lista encontrada.</span>
                    </div>
                )}
            </>
        );
    }

    return (
        <Container>
            <Title>{isCurrentUser ? "Minhas listas" : `Listas do ${params.username}`}</Title>
            {isCurrentUser && <Subtitle>Organize sua leitura do jeito que você quiser.</Subtitle>}

            <Separator className="my-6 bg-gray-300" />

            <div className="mt-4 flex flex-col gap-8 md:flex-row lg:gap-6 xl:gap-8">
                <div className="w-full md:w-1/4">
                    {isCurrentUser && (
                        <>
                            <Button
                                variant="default"
                                onClick={handleCreateBookList}
                                disabled={createBookList.isLoading}
                            >
                                <PlusCircle size={18} />
                                Nova lista
                            </Button>

                            <Separator className="my-6 bg-black" />
                        </>
                    )}
                    {renderBookLists()}
                </div>

                {bookLists?.[activeBookList] ? (
                    <div className="flex w-full flex-col gap-8 md:w-3/4">
                        <div className="flex gap-4">
                            <div className="flex h-56 w-56 rounded-md bg-neutral-800 transition-all">
                                {bookLists[activeBookList].imageUrl ? (
                                    <Image
                                        src={bookLists[activeBookList].imageUrl as string}
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
                                            {bookLists[activeBookList].name}
                                        </h2>

                                        {isCurrentUser && (
                                            <>
                                                <UpdateBookListDialog
                                                    activeBookList={activeBookList}
                                                    bookLists={bookLists}
                                                    isUpdateBookListLoading={
                                                        updateBookList.isLoading
                                                    }
                                                    handleUpdateBookList={handleUpdateBookList}
                                                />

                                                <DeleteBookListDialog
                                                    bookListId={bookLists[activeBookList].id}
                                                    isDeleteBookLoading={
                                                        removeBookFromBookList.isLoading
                                                    }
                                                    handleDeleteBookList={handleDeleteBookList}
                                                />
                                            </>
                                        )}
                                    </div>
                                    <p className="mt-2 text-zinc-500">
                                        {bookLists[activeBookList].description}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    {targetUser && <UserHoverCard user={targetUser} />}
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
                                            <TableCell>
                                                <Link
                                                    href={`/livros/${bookOnBookList.bookId}`}
                                                    className="font-medium hover:underline"
                                                >
                                                    {bookOnBookList.book.title}
                                                </Link>
                                            </TableCell>
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
                                                                handleRemoveBookFromBookList(
                                                                    bookOnBookList,
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
