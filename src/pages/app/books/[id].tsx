import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { getYear, isValid, parse, parseISO } from "date-fns";
import { BookOpen, Clock, Heart, Star } from "phosphor-react";

import { api } from "@/lib/api";

import { Container } from "@/components/layout/Container";
import { Title } from "@/components/Title";
import { Subtitle } from "@/components/Subtitle";
import { Separator } from "@/components/Separator";
import { Button } from "@/components/Button";
import { BookDataFromGoogle } from "@/components/layout/NavBarLogged";

interface BookImagesDataFromGoogle {
    id: string;
    volumeInfo: {
        title: string;
        imageLinks?: {
            smallThumbnail?: string;
            thumbnail?: string;
            small?: string;
            medium?: string;
            large?: string;
            extraLarge?: string;
        };
    };
}

interface BookData {
    id: string;
    title: string;
    subtitle?: string | null;
    authors: string[];
    publisher?: string | null;
    publishDate?: Date | null;
    language?: string | null;
    pageCount?: number | null;
    description?: string | null;
    image?: string;
}

export default function Book() {
    const router = useRouter();
    const [bookData, setBookData] = useState<BookData | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    async function fetchBookFromGoogle() {
        try {
            const { data } = await axios.get<BookDataFromGoogle>(
                `https://www.googleapis.com/books/v1/volumes/${router.query.id}`,
            );

            const {
                title,
                subtitle,
                authors,
                publisher,
                publishedDate,
                language,
                pageCount,
                description,
                imageLinks,
            } = data.volumeInfo;

            const parsedDate = parse(publishedDate, "yyyy-MM-dd", new Date());

            setBookData({
                id: data.id,
                title: title,
                subtitle: subtitle,
                authors: authors,
                publisher: publisher,
                publishDate: isValid(parsedDate) ? parsedDate : null,
                language: language,
                pageCount: pageCount,
                description: description,
                image: imageLinks?.medium?.replace("&edge=curl", ""),
            });

            await api.post("/book", {
                id: data.id,
                title,
                subtitle,
                authors,
                publisher,
                publishDate: isValid(parsedDate) ? parsedDate : null,
                language,
                pageCount,
                description,
            });
        } catch (err) {
            throw err;
        } finally {
            setIsLoadingData(false);
        }
    }

    useEffect(() => {
        if (!router.isReady) return;

        async function fetchBookFromDatabase() {
            try {
                const { data } = await api.get<BookData>(`/book/${router.query.id}`);

                if (!data) {
                    await fetchBookFromGoogle();
                } else {
                    const {
                        id,
                        title,
                        subtitle,
                        authors,
                        publisher,
                        publishDate,
                        language,
                        pageCount,
                        description,
                    } = data;

                    // get image from google
                    const googleImageResponse = await axios.get<BookImagesDataFromGoogle>(
                        `https://www.googleapis.com/books/v1/volumes/${router.query.id}?fields=id,volumeInfo(title,imageLinks)`,
                    );

                    setBookData({
                        id,
                        title,
                        subtitle,
                        authors,
                        publisher,
                        publishDate,
                        language,
                        pageCount,
                        description,
                        image: googleImageResponse.data.volumeInfo.imageLinks?.medium?.replace(
                            "&edge=curl",
                            "",
                        ),
                    });
                }
            } catch (err) {
                if (err instanceof AxiosError) {
                    console.log("err", err);
                }

                throw err;
            } finally {
                setIsLoadingData(false);
            }
        }

        fetchBookFromDatabase();
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
                        <Title>{bookData?.title ?? ""}</Title>

                        {bookData?.subtitle && <Subtitle>{bookData?.subtitle ?? ""}</Subtitle>}
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
                                    {bookData?.image ? (
                                        <Image
                                            src={bookData.image}
                                            alt=""
                                            width={312}
                                            height={468}
                                            className="mx-auto rounded-lg"
                                        />
                                    ) : (
                                        <div className="h-full w-full rounded-md bg-gray-200"></div>
                                    )}
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
                                                {bookData?.authors}
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
                                            {bookData?.publishDate
                                                ? getYear(new Date(bookData.publishDate))
                                                : "Sem informação"}
                                        </span>
                                    )}
                                </div>

                                <Separator />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Editora</span>
                                    {isLoadingData ? (
                                        <div className="w-16 animate-pulse rounded-md bg-gray-200"></div>
                                    ) : (
                                        <span>{bookData?.publisher ?? "Sem informação"}</span>
                                    )}
                                </div>

                                <Separator />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Idioma</span>
                                    {isLoadingData ? (
                                        <div className="w-16 animate-pulse rounded-md bg-gray-200"></div>
                                    ) : (
                                        <span>{bookData?.language ?? "Sem informação"}</span>
                                    )}
                                </div>

                                <Separator />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Páginas</span>
                                    {isLoadingData ? (
                                        <div className="w-16 animate-pulse rounded-md bg-gray-200"></div>
                                    ) : (
                                        <span>{bookData?.pageCount ?? "Sem informação"}</span>
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
                                        dangerouslySetInnerHTML={{
                                            __html: bookData?.description ?? "",
                                        }}
                                    ></p>
                                </div>

                                {/* Book review */}
                                <div className="flex flex-col gap-4">
                                    <div className="h-80 w-64 rounded-lg border border-black px-3 py-2 text-sm">
                                        <div className="mt-1 flex flex-col items-center gap-2">
                                            <span className="font-semibold">Sua avaliação</span>
                                            <div className="flex gap-1">
                                                <Star size={34} />
                                                <Star size={34} />
                                                <Star size={34} />
                                                <Star size={34} />
                                                <Star size={34} />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex flex-col gap-2">
                                            <Button size="sm">
                                                <BookOpen size={20} />
                                                <span className="font-medium">
                                                    Progresso de leitura
                                                </span>
                                            </Button>
                                            <Button size="sm">
                                                <Heart size={20} />
                                                <span className="font-medium">Curtir</span>
                                            </Button>
                                            <Button size="sm">
                                                <Clock size={20} />
                                                <span className="font-medium">
                                                    Adicionar a lista
                                                </span>
                                            </Button>
                                        </div>

                                        <Separator />

                                        <div className="flex flex-col gap-2">
                                            <Button size="sm" className="bg-white">
                                                <span className="font-medium">Compartilhar</span>
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Community rating */}
                                    <div className="h-64 w-64 rounded-lg border border-black px-3 py-2 text-sm">
                                        <div className="my-1 flex items-center justify-between">
                                            <h3 className="font-medium">Avaliações</h3>
                                            <div className="flex items-center gap-1">
                                                <Star size={14} weight="fill" />
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    4.95 (12)
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center">
                                            <div className="flex items-center gap-1 text-sm font-medium">
                                                <span>5</span>
                                                <Star size={14} weight="fill" />
                                            </div>
                                            <div className="mx-2 h-5 flex-1 overflow-hidden rounded border border-black bg-gray-200 dark:bg-gray-700">
                                                <div className="h-5 w-[70%] rounded bg-yellow-500"></div>
                                            </div>
                                            <span className="w-8 text-sm font-medium">70%</span>
                                        </div>
                                        <div className="mt-4 flex items-center">
                                            <div className="flex items-center gap-1 text-sm font-medium">
                                                <span>4</span>
                                                <Star size={14} weight="fill" />
                                            </div>
                                            <div className="mx-2 h-5 flex-1 overflow-hidden rounded border border-black bg-gray-200 dark:bg-gray-700">
                                                <div className="h-5 w-[17%] rounded bg-yellow-500"></div>
                                            </div>
                                            <span className="w-8 text-sm font-medium">17%</span>
                                        </div>
                                        <div className="mt-4 flex items-center">
                                            <div className="flex items-center gap-1 text-sm font-medium">
                                                <span>3</span>
                                                <Star size={14} weight="fill" />
                                            </div>
                                            <div className="mx-2 h-5 flex-1 overflow-hidden rounded border border-black bg-gray-200 dark:bg-gray-700">
                                                <div className="h-5 w-[8%] rounded bg-yellow-500"></div>
                                            </div>
                                            <span className="w-8 text-sm font-medium">8%</span>
                                        </div>
                                        <div className="mt-4 flex items-center">
                                            <div className="flex items-center gap-1 text-sm font-medium">
                                                <span>2</span>
                                                <Star size={14} weight="fill" />
                                            </div>
                                            <div className="mx-2 h-5 flex-1 overflow-hidden rounded border border-black bg-gray-200 dark:bg-gray-700">
                                                <div className="h-5 w-[4%] rounded bg-yellow-500"></div>
                                            </div>
                                            <span className="w-8 text-sm font-medium">4%</span>
                                        </div>
                                        <div className="mt-4 flex items-center">
                                            <div className="flex items-center gap-1 text-sm font-medium">
                                                <span>1</span>
                                                <Star size={14} weight="fill" />
                                            </div>
                                            <div className="mx-2 h-5 flex-1 overflow-hidden rounded border border-black bg-gray-200 dark:bg-gray-700">
                                                <div className="h-5 w-[1%] rounded bg-yellow-500"></div>
                                            </div>
                                            <span className="w-8 text-sm font-medium">1%</span>
                                        </div>
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
