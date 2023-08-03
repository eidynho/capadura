"use client";

import { Fragment, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    CaretDown,
    Check,
    CheckSquareOffset,
    ListBullets,
    MagnifyingGlass,
    PlusCircle,
    X,
} from "phosphor-react";
import { toast } from "react-toastify";

import { api } from "@/lib/api";
import { BookData } from "../page";
import { useDebounce } from "@/hooks/useDebounce";
import { AuthContext } from "@/contexts/AuthContext";

import { Button } from "@/components/Button";
import { BaseDialog } from "@/components/radix-ui/BaseDialog";
import { Menu, Transition } from "@headlessui/react";
import { Separator } from "@/components/Separator";

interface BookOnBookList {
    id: string;
    bookId: string;
    bookListId: string;
}

interface BookListData {
    id: string;
    name: string;
    description: string;
    books: BookOnBookList[];
}

interface BookListMenuProps {
    bookData: BookData;
}

export function BookListMenu({ bookData }: BookListMenuProps) {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [bookLists, setBookLists] = useState<BookListData[] | null>(null);
    const [searchName, setSearchName] = useState("");

    const debouncedSearchName = useDebounce<string>(searchName, 400);

    function handleToggleDialog(state = false) {
        setIsOpen(state);
    }

    useEffect(() => {
        async function getUserBookList() {
            if (!user) return;

            setIsFetching(true);

            try {
                let query = "";
                if (debouncedSearchName.trim()) {
                    query = `?q=${debouncedSearchName.trim()}`;
                }

                const { data } = await api.get<BookListData[]>(
                    `/booklists/user/${user.id}${query}`,
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

    async function toggleBookIntoBookList(bookList: BookListData, bookInBookList?: BookOnBookList) {
        try {
            if (!!bookInBookList) {
                await api.delete(`/books-on-booklists/${bookInBookList.id}`);

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

    function moveToUserBookLists() {
        if (!user) return;

        router.push(`/${user.username}/booklists`);
    }

    function renderBookLists() {
        return (
            <>
                {bookLists?.length ? (
                    bookLists.map((bookList) => {
                        const bookInBookList = bookList.books?.find(
                            (bookOnBookList) => bookOnBookList.bookId === bookData.id,
                        );
                        return (
                            <div
                                key={bookList.id}
                                onClick={() => toggleBookIntoBookList(bookList, bookInBookList)}
                                className="relative mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-lg border border-transparent py-2 pl-4 hover:bg-black hover:bg-opacity-10"
                            >
                                <span className="w-4/5 truncate">{bookList.name}</span>

                                <div className="absolute right-4 top-2">
                                    {bookInBookList && (
                                        <span title="O livro está na lista">
                                            <Check
                                                size={20}
                                                className="text-green-500"
                                                weight="bold"
                                            />
                                        </span>
                                    )}
                                </div>
                            </div>
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
        <>
            <Menu as="div" className="relative z-10 inline-block">
                <Menu.Button className="flex items-center gap-2 rounded-lg border border-black bg-white px-2 py-2 text-black transition-all hover:shadow-[0.25rem_0.25rem_#000]">
                    <CheckSquareOffset size={20} />
                    <span className="text-sm font-medium">Adicionar a lista</span>
                    <CaretDown size={14} />
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute -right-[7.5rem] mt-1 h-96 w-72 overflow-y-auto rounded-md border border-black bg-white py-2 text-sm shadow-[0.25rem_0.25rem_#000] ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="mx-2 flex flex-col items-center justify-between gap-2">
                            <div className="relative w-full">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MagnifyingGlass size={18} />
                                </div>
                                <input
                                    type="text"
                                    onChange={(e) => setSearchName(e.target.value)}
                                    value={searchName}
                                    placeholder="Procurar lista"
                                    maxLength={120}
                                    className="block w-full rounded-lg border border-black p-2 pl-10 text-sm outline-none focus:border-yellow-500 focus:ring-yellow-500"
                                />
                                {searchName && (
                                    <div
                                        className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                                        onClick={() => setSearchName("")}
                                    >
                                        <X size={18} />
                                    </div>
                                )}
                            </div>

                            <div className="mb-1 flex w-full items-center justify-center">
                                <div
                                    onClick={createBookList}
                                    className="mr-2 flex cursor-pointer select-none items-center gap-2 rounded-lg border border-transparent px-2 py-2 hover:bg-black hover:bg-opacity-10"
                                >
                                    <PlusCircle size={18} />
                                    Criar lista
                                </div>

                                <div className="mx-px h-8 w-px bg-black"></div>

                                <div
                                    onClick={moveToUserBookLists}
                                    className="ml-2 flex cursor-pointer select-none items-center gap-2 rounded-lg border border-transparent px-2 py-2 hover:bg-black hover:bg-opacity-10"
                                >
                                    <ListBullets size={18} />
                                    Ver listas
                                </div>
                            </div>
                        </div>

                        <Separator className="mx-5 my-2" />

                        <Menu.Item>{renderBookLists()}</Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>

            {/* <Button size="sm" onClick={() => handleToggleDialog(true)}>
                <CheckSquareOffset size={20} />
                <span className="font-medium">Adicionar a lista</span>
            </Button> */}

            <BaseDialog
                size="max-w-3xl"
                title="Listas"
                isOpen={isOpen}
                closeDialog={() => handleToggleDialog(false)}
            >
                {/* Dialog body */}
                <div className="px-4 py-6">
                    <div className="mb-4">
                        <div className="mt-6 flex w-full flex-col items-center">
                            {isFetching ? (
                                <>
                                    {Array.from({ length: 2 }, () => (
                                        <div className="mb-2 flex w-full animate-pulse gap-4">
                                            <div className="h-24 w-24 rounded-lg bg-gray-300/80"></div>
                                            <div className="flex flex-1 flex-col gap-1">
                                                <div className="h-6 w-1/3 rounded-lg bg-gray-300"></div>
                                                <div className="h-5 w-2/3 rounded-lg bg-gray-300/80"></div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : bookLists?.length ? (
                                bookLists.map((bookList) => (
                                    <div className="flex w-full gap-4 rounded-lg border border-black px-3 py-2">
                                        <div className="h-24 w-24 rounded-lg border border-black"></div>
                                        <div className="flex flex-1 items-center justify-between gap-2">
                                            <div className="flex flex-col">
                                                <span className="font-semibold">
                                                    {bookList.name}
                                                </span>
                                                <span className="text-sm">teste</span>
                                            </div>

                                            <Button size="sm" onClick={createBookList}>
                                                <PlusCircle size={18} />
                                                Adicionar
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <>
                                    {debouncedSearchName ? (
                                        <span className="break-all">
                                            Nenhuma lista com a busca "
                                            <strong>{debouncedSearchName}</strong>" foi encontrada.
                                        </span>
                                    ) : (
                                        <span>Nenhuma lista encontrada.</span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </BaseDialog>
        </>
    );
}
