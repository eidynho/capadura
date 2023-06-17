import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { api } from "@/lib/api";

import { Container } from "@/components/layout/Container";
import { Title } from "@/components/Title";
import { Separator } from "@/components/Separator";
import { BookData } from "@/components/layout/NavBarLogged";
import axios from "axios";
import Image from "next/image";
import { Subtitle } from "@/components/Subtitle";
import { Button } from "@/components/Button";
import { BookOpen, Clock, Heart, Star } from "phosphor-react";
import Link from "next/link";

export default function Book() {
    const router = useRouter();
    const [bookData, setBookData] = useState<BookData | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!router.isReady) return;

        async function getBook() {
            try {
                const { data } = await axios.get<BookData>(
                    `https://www.googleapis.com/books/v1/volumes/${router.query.id}`,
                );

                setBookData(data);
            } catch (err) {
                throw err;
            } finally {
                setIsLoadingData(false);
            }
        }
        getBook();
    }, [router.isReady, router.query.id]);

    function bookHeader() {
        return (
            <div className="mb-3 flex flex-col items-center gap-2 md:items-start">
                {isLoadingData ? (
                    <>
                        <div className="h-9 w-64 animate-pulse rounded-md bg-gray-200"></div>
                        <div className="h-6 w-80 animate-pulse rounded-md bg-gray-200"></div>
                        <div className="my-2 h-6 w-56 animate-pulse rounded-md bg-gray-200"></div>
                    </>
                ) : (
                    <>
                        <Title>{bookData?.volumeInfo.title ?? ""}</Title>

                        {bookData?.volumeInfo.subtitle && <Subtitle>{bookData?.volumeInfo.subtitle ?? ""}</Subtitle>}
                    </>
                )}
            </div>
        );
    }

    return (
        <Container>
            <div className="mt-5 flex flex-col justify-center">
                <div className="flex flex-col">
                    <div className="flex flex-col items-start justify-center gap-8 md:flex-row">
                        <div className="w-full md:w-[19.5rem]">
                            {/* Book header */}
                            <div className="block md:hidden">{bookHeader()}</div>

                            {/* Book image */}
                            {isLoadingData ? (
                                <div className="h-full w-full animate-pulse rounded-md bg-gray-200"></div>
                            ) : (
                                <div className="flex w-full gap-6">
                                    <Image
                                        src={bookData?.volumeInfo.imageLinks.medium?.replace("&edge=curl", "")}
                                        alt=""
                                        width={312}
                                        height={468}
                                        className="mx-auto rounded-lg"
                                    />
                                </div>
                            )}

                            {/* Book data */}
                            <div className="mt-3 rounded-lg border border-black pb-4">
                                <div className="mx-4 mt-4 flex justify-between text-sm">
                                    <span className="font-semibold">Escrito por</span>
                                    {isLoadingData ? (
                                        <div className="w-16 animate-pulse rounded-md bg-gray-200"></div>
                                    ) : (
                                        <div className="group relative">
                                            <Link href="" className="font-semibold">
                                                {bookData?.volumeInfo.authors.join(", ")}
                                            </Link>
                                            <div className="absolute bottom-0 left-0 right-auto top-auto h-[1px] w-0 bg-black transition-all duration-200 will-change-auto group-hover:w-full"></div>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Ano de publicação</span>
                                    {isLoadingData ? (
                                        <div className="w-16 animate-pulse rounded-md bg-gray-200"></div>
                                    ) : (
                                        <span>
                                            {bookData?.volumeInfo.publishedDate.split("-")[0] ?? "Sem informação"}
                                        </span>
                                    )}
                                </div>

                                <Separator />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Editora</span>
                                    {isLoadingData ? (
                                        <div className="w-16 animate-pulse rounded-md bg-gray-200"></div>
                                    ) : (
                                        <span>{bookData?.volumeInfo.publisher ?? "Sem informação"}</span>
                                    )}
                                </div>

                                <Separator />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Idioma</span>
                                    {isLoadingData ? (
                                        <div className="w-16 animate-pulse rounded-md bg-gray-200"></div>
                                    ) : (
                                        <span>{bookData?.volumeInfo.language ?? "Sem informação"}</span>
                                    )}
                                </div>

                                <Separator />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Páginas</span>
                                    {isLoadingData ? (
                                        <div className="w-16 animate-pulse rounded-md bg-gray-200"></div>
                                    ) : (
                                        <span>{bookData?.volumeInfo.pageCount ?? "Sem informação"}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full flex-col md:w-[calc(100%-344px)]">
                            {/* Book header */}
                            <div className="hidden md:block">{bookHeader()}</div>

                            <div className="flex w-full flex-col gap-8 xl:flex-row">
                                {/* Book content */}
                                <div className="flex w-full flex-col gap-2 xl:w-[calc(100%-288px)]">
                                    <p
                                        className="text-justify text-sm leading-7"
                                        dangerouslySetInnerHTML={{ __html: bookData?.volumeInfo.description ?? "" }}
                                    ></p>
                                </div>

                                {/* Book review */}
                                <div className="h-80 w-64 rounded-lg border border-black px-3 py-2 text-sm">
                                    <div className="mt-1 flex flex-col items-center gap-2">
                                        <span className="font-semibold">Avaliação</span>
                                        <div className="flex gap-1">
                                            <Star size={30} />
                                            <Star size={30} />
                                            <Star size={30} />
                                            <Star size={30} />
                                            <Star size={30} />
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex flex-col gap-2">
                                        <Button size="sm">
                                            <BookOpen size={20} />
                                            <span className="font-medium">Status de leitura</span>
                                        </Button>
                                        <Button size="sm">
                                            <Heart size={20} />
                                            <span className="font-medium">Curtir</span>
                                        </Button>
                                        <Button size="sm">
                                            <Clock size={20} />
                                            <span className="font-medium">Adicionar a lista</span>
                                        </Button>
                                    </div>

                                    <Separator />

                                    <div className="flex flex-col gap-2">
                                        <Button size="sm" className="bg-white">
                                            <span className="font-medium">Compartilhar</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
