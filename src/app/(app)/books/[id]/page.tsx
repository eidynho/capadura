"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { getYear, isValid, parse } from "date-fns";
import { Clock, Image as ImageIcon } from "phosphor-react";
import { toast } from "react-toastify";

import { api } from "@/lib/api";

import { Container } from "@/components/layout/Container";
import { Title } from "@/components/Title";
import { Subtitle } from "@/components/Subtitle";
import { Separator } from "@/components/Separator";
import { Button } from "@/components/Button";
import { BookDataFromGoogle } from "@/components/ApplicationSearch";
import { ReadsProgress } from "@/components/ReadsProgress";
import { RatingChart } from "@/components/RatingChart";
import { LinkUnderline } from "@/components/LinkUnderline";
import Loading from "./loading";
import { Like } from "./components/Like";
import { BookListMenu } from "./components/BookListMenu";

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

export interface BookData {
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

export interface ProgressData {
    id: string;
    readId: string;
    createdAt: Date | string;
    description: string;
    isSpoiler: boolean;
    page: number | null;
    percentage: number | null;
    read?: ReadData;
}
export interface ReadData {
    id: string;
    bookId: string;
    startDate: Date | string;
    endDate: Date | string | null;
    isPrivate: boolean;
    reviewContent: string | null;
    reviewRating: number | null;
    reviewIsSpoiler: boolean | null;
    status: string;
    progress: ProgressData[];
    book?: BookData;
}

interface BookProps {
    params: {
        id: string;
    };
}

export async function generateMetadata({ params }: BookProps) {
    return {
        title: params.id,
    };
}

export default function Book({ params }: BookProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [bookData, setBookData] = useState<BookData | null>(null);

    async function fetchBookFromGoogle() {
        try {
            const { data } = await axios.get<BookDataFromGoogle>(
                `https://www.googleapis.com/books/v1/volumes/${params.id}`,
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
            toast.error("Erro ao carregar os dados do livro.");
            throw err;
        }
    }

    useEffect(() => {
        async function fetchBookFromDatabase() {
            setIsMounted(false);

            try {
                const { data } = await api.get<BookData>(`/book/${params.id}`);

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
                        `https://www.googleapis.com/books/v1/volumes/${params.id}?fields=id,volumeInfo(title,imageLinks)`,
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
                toast.error("Erro ao carregar os dados do livro.");
                throw err;
            } finally {
                setIsMounted(true);
            }
        }

        fetchBookFromDatabase();
    }, [params.id]);

    if (!isMounted || !bookData) {
        return <Loading />;
    }

    function bookHeader() {
        return (
            <div className="mb-3 flex flex-col items-center gap-2 md:items-start">
                <Title>{bookData?.title ?? ""}</Title>
                {bookData?.subtitle && <Subtitle>{bookData?.subtitle ?? ""}</Subtitle>}
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
                            <div className="flex w-full gap-6">
                                {bookData.image ? (
                                    <Image
                                        src={bookData.image}
                                        alt=""
                                        width={312}
                                        height={468}
                                        quality={100}
                                        priority
                                        className="mx-auto rounded-lg"
                                    />
                                ) : (
                                    <div className="flex h-96 w-full flex-col items-center justify-center rounded-md border border-black bg-gray-200 opacity-70">
                                        <ImageIcon size={40} />
                                        <span className="text-xs">Sem imagem</span>
                                    </div>
                                )}
                            </div>

                            {/* Book data */}
                            <div className="mt-3 rounded-lg border border-black pb-4">
                                <div className="mx-4 mt-4 flex justify-between text-sm">
                                    <span className="font-semibold">Escrito por</span>

                                    <LinkUnderline href="" className="font-semibold">
                                        {bookData.authors}
                                    </LinkUnderline>
                                </div>

                                <Separator />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Ano de publicação</span>
                                    <span>
                                        {bookData.publishDate
                                            ? getYear(new Date(bookData.publishDate))
                                            : "Sem informação"}
                                    </span>
                                </div>

                                <Separator />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Editora</span>

                                    <span>{bookData.publisher ?? "Sem informação"}</span>
                                </div>

                                <Separator />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Idioma</span>

                                    <span>{bookData.language ?? "Sem informação"}</span>
                                </div>

                                <Separator />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Páginas</span>

                                    <span>{bookData.pageCount ?? "Sem informação"}</span>
                                </div>

                                <Separator />

                                {/* Book action buttons */}
                                <div className="flex w-full items-center justify-center gap-2">
                                    <BookListMenu bookData={bookData} />
                                    <Like bookId={bookData.id} />
                                </div>
                            </div>

                            {/* Community rating */}
                            <RatingChart bookId={bookData.id} />
                        </div>

                        <div className="flex w-full flex-col md:w-[calc(100%-344px)]">
                            {/* Book header */}
                            <div className="hidden md:block">{bookHeader()}</div>

                            <div className="flex w-full flex-col gap-8 xl:flex-row">
                                <div className="flex w-full flex-col gap-2">
                                    {/* Book content */}
                                    <p
                                        className="text-justify text-sm leading-7"
                                        dangerouslySetInnerHTML={{
                                            __html: bookData.description ?? "",
                                        }}
                                    ></p>

                                    <ReadsProgress bookData={bookData} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
