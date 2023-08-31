"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, BookOpen, ImageOff, Search, User } from "lucide-react";
import { toast } from "react-toastify";

import { useDebounce } from "@/hooks/useDebounce";
import { useDidMountEffect } from "@/hooks/useDidMountEffect";
import { fetchGoogleBooks } from "@/utils/fetch-google-books";
import { GoogleAPIData } from "@/components/ApplicationSearch";

import { Container } from "@/components/layout/Container";
import { Title } from "@/components/Title";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function Books() {
    const [isLoading, setIsFetchingBooks] = useState(true);
    const [books, setBooks] = useState<GoogleAPIData>({
        items: [],
        totalItems: 0,
    });
    const [page, setPage] = useState(1);
    const [searchName, setSearchName] = useState("ponto de inflexão");

    const debouncedSearchName = useDebounce<string>(searchName, 400);

    useEffect(() => {
        const getBooks = async () => {
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
                toast.error("Erro ao carregar os livros.");
                throw err;
            } finally {
                setIsFetchingBooks(false);
            }
        };
        getBooks();
    }, [debouncedSearchName, page]);

    useDidMountEffect(() => {
        if (!searchName) return;

        setIsFetchingBooks(true);
    }, [searchName]);

    return (
        <Container>
            <div className="flex flex-col justify-center">
                <Title>Biblioteca</Title>

                <div className="w-full overflow-x-auto sm:rounded-md">
                    <div className="mb-4">
                        <label htmlFor="search-books" className="sr-only">
                            Procurar livros
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search size={18} className="opacity-50" />
                            </div>
                            <Input
                                type="text"
                                id="search-books"
                                onChange={(e) => setSearchName(e.target.value)}
                                placeholder="Procurar livros"
                                className="w-80 pl-10"
                            />
                        </div>
                    </div>

                    <div className="flex w-full flex-wrap justify-center gap-4">
                        {!!books?.items?.length &&
                            books.items.map((item) => (
                                <Link
                                    href={`/livros/${item.id}`}
                                    key={item.id}
                                    className="h-44 w-2/5 cursor-pointer rounded-md border border-dark p-2 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[0.25rem_0.25rem_#000]"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="h-[9.75rem] w-[7rem] overflow-hidden rounded-md border border-dark">
                                            {item.volumeInfo.imageLinks?.thumbnail ? (
                                                <Image
                                                    src={item.volumeInfo.imageLinks?.thumbnail?.replace(
                                                        "edge=curl",
                                                        "",
                                                    )}
                                                    alt=""
                                                    width={110}
                                                    height={160}
                                                    quality={100}
                                                    className="w-full overflow-hidden"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center">
                                                    <ImageOff
                                                        size={36}
                                                        strokeWidth={1.6}
                                                        className="text-muted-foreground"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex h-40 w-96 flex-col justify-between">
                                            <div>
                                                <div className="flex items-start gap-2">
                                                    <h2
                                                        className="line-clamp-2 text-lg font-bold"
                                                        title={item.volumeInfo.title}
                                                    >
                                                        {item.volumeInfo.title}
                                                    </h2>
                                                    <span className="mt-[5px] text-sm font-medium text-gray-500">
                                                        {item.volumeInfo.publishedDate &&
                                                            item.volumeInfo.publishedDate.split(
                                                                "-",
                                                            )[0]}
                                                    </span>
                                                </div>
                                                <span className="block text-sm">
                                                    {item.volumeInfo.subtitle}
                                                </span>
                                                <span className="flex items-center gap-2 text-sm underline">
                                                    <User size={20} />
                                                    {item.volumeInfo.authors?.[0]}
                                                </span>
                                                <span className="flex items-center gap-2 text-sm">
                                                    <BookOpen size={20} />
                                                    {item.volumeInfo.pageCount}
                                                </span>
                                            </div>
                                            <span className="line-clamp-2 text-sm">
                                                {item.volumeInfo.description}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>

                    <div className="mt-3 flex flex-col items-center text-sm">
                        <span>
                            Exibindo <strong>{(page - 1) * 10 + 1}</strong> a{" "}
                            <strong>{(page - 1) * 10 + 10}</strong> de{" "}
                            <strong>{books.totalItems}</strong> resultados
                        </span>
                        <div className="mt-3 flex items-center gap-4">
                            <Button
                                size="sm"
                                onClick={() => setPage((prev) => prev - 1)}
                                disabled={page === 1}
                            >
                                <ArrowLeft size={18} />
                                Anterior
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => setPage((prev) => prev + 1)}
                                disabled={page * 10 >= books.totalItems}
                            >
                                Próximo
                                <ArrowRight size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
