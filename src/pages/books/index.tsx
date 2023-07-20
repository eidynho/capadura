import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Image as ImageIcon, User } from "phosphor-react";
import { toast } from "react-toastify";

import { useDebounce } from "@/hooks/useDebounce";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/Button";
import { Title } from "@/components/Title";
import { InputTextSearch } from "@/components/InputText";
import axios from "axios";
import Image from "next/image";
import { GoogleAPIData } from "@/components/ApplicationSearch";

export default function Books() {
    const [isLoading, setIsLoading] = useState(true);
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
                const query = [];

                query.push("q=" + `"${debouncedSearchName}"`);
                query.push("langRestrict=" + "pt-BR");
                query.push("maxResults=" + 10);
                query.push("startIndex=" + (page - 1) * 10) + 1;
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
                toast.error("Erro ao carregar os livros.");
                throw err;
            } finally {
                setIsLoading(false);
            }
        };
        getBooks();
    }, [debouncedSearchName, page]);

    return (
        <Container>
            <div className="flex flex-col justify-center">
                <Title>Biblioteca</Title>

                <div className="relative w-full overflow-x-auto sm:rounded-lg">
                    <InputTextSearch
                        id="search-books"
                        label="Procurar livros"
                        placeholder="Buscar pelo nome"
                        onChange={(e) => setSearchName(e.target.value)}
                        className="mb-4"
                    />

                    <div className="flex w-full flex-wrap justify-center gap-4">
                        {books.items.map((item) => (
                            <Link
                                href={`/books/${item.id}`}
                                key={item.id}
                                className="h-44 w-2/5 cursor-pointer rounded-lg border border-black p-2 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[0.25rem_0.25rem_#000]"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="h-[9.75rem] w-[7rem] overflow-hidden rounded-lg border border-black">
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
                                                <ImageIcon
                                                    size={42}
                                                    weight="bold"
                                                    className="text-gray-500"
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
                                                        item.volumeInfo.publishedDate.split("-")[0]}
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
