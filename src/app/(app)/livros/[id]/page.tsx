"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { isValid, parse } from "date-fns";
import { ImageOff } from "lucide-react";
import { toast } from "react-toastify";

import { publishDateFormat } from "@/utils/publish-date-format";

import { useFetchBook } from "@/endpoints/queries/booksQueries";
import { useCreateBook, useUpdateBookImage } from "@/endpoints/mutations/booksMutations";

import Loading from "./loading";

import { ReadsProgress } from "./components/Read";
import { Like } from "./components/Like";
import { BookListMenu } from "./components/BookListMenu";
import { Container } from "@/components/layout/Container";
import { Title } from "@/components/Title";
import { Subtitle } from "@/components/Subtitle";
import { Separator } from "@/components/ui/Separator";
import { BookDataFromGoogle } from "@/components/ApplicationSearch";
import { RatingChart } from "@/components/RatingChart";
import { LinkUnderline } from "@/components/LinkUnderline";

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
    imageKey?: string | null;
    imageUrl?: string;
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

    const { data: bookFetchedFromDb, isFetched: isFetchedBook } = useFetchBook({
        bookId: params.id,
        enabled: !!params.id,
    });

    const createBook = useCreateBook();
    const updateBookImage = useUpdateBookImage();

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

            createBook.mutate(
                {
                    bookId: params.id,
                    title,
                    subtitle,
                    authors,
                    publisher,
                    publishDate: isValid(parsedDate) ? parsedDate : undefined,
                    language,
                    pageCount,
                    description,
                    imageLink: imageLinks?.medium?.replace("&edge=curl", ""),
                },
                {
                    onSuccess: (createdBook) => {
                        setBookData(createdBook);
                    },
                },
            );
        } catch (err) {
            toast.error("Erro ao carregar os dados do livro.");
            throw err;
        }
    }
    useEffect(() => {
        if (!isFetchedBook) return;

        async function fetchBook() {
            setIsMounted(false);

            try {
                if (!bookFetchedFromDb) {
                    await fetchBookFromGoogle();
                } else {
                    setBookData(bookFetchedFromDb);

                    if (!bookFetchedFromDb.imageKey) {
                        // get image from google and update db
                        const googleImageResponse = await axios.get<BookImagesDataFromGoogle>(
                            `https://www.googleapis.com/books/v1/volumes/${params.id}?fields=id,volumeInfo(title,imageLinks)`,
                        );

                        const imageLinkFromGoogle =
                            googleImageResponse.data?.volumeInfo?.imageLinks?.medium?.replace(
                                "&edge=curl",
                                "",
                            );

                        if (imageLinkFromGoogle) {
                            updateBookImage.mutate(
                                {
                                    bookId: params.id,
                                    imageLink: imageLinkFromGoogle,
                                },
                                {
                                    onSuccess: (updatedBookData) => {
                                        setBookData((prev) => {
                                            if (!prev) return bookFetchedFromDb;

                                            return {
                                                ...prev,
                                                imageKey: updatedBookData.imageKey,
                                                imageUrl: updatedBookData.imageUrl,
                                            };
                                        });
                                    },
                                },
                            );
                        }
                    }
                }
            } catch (err) {
                toast.error("Erro ao carregar os dados do livro.");
                throw err;
            } finally {
                setIsMounted(true);
            }
        }

        fetchBook();
    }, [params.id, isFetchedBook]);

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
                                {bookData.imageUrl ? (
                                    <Image
                                        src={bookData.imageUrl}
                                        alt=""
                                        width={312}
                                        height={468}
                                        quality={100}
                                        priority
                                        className="mx-auto rounded-md"
                                    />
                                ) : (
                                    <div className="flex h-96 w-full flex-col items-center justify-center rounded-md border border-black bg-zinc-500/10 opacity-75">
                                        <ImageOff size={36} strokeWidth={1.6} />
                                        <span className="mt-1 text-sm font-medium text-muted-foreground">
                                            Sem imagem
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Book data */}
                            <div className="mt-3 rounded-md border border-black pb-4">
                                <div className="mx-4 mt-4 flex justify-between text-sm">
                                    <span className="font-semibold">Escrito por</span>

                                    {!!bookData.authors?.[0] ? (
                                        <LinkUnderline href="" className="font-semibold">
                                            {bookData.authors[0]}
                                        </LinkUnderline>
                                    ) : (
                                        <span>-</span>
                                    )}
                                </div>

                                <Separator className="my-4 bg-black dark:bg-primary" />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Ano de publicação</span>
                                    <span>{publishDateFormat(bookData.publishDate)}</span>
                                </div>

                                <Separator className="my-4 bg-black dark:bg-primary" />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Editora</span>

                                    <span>{bookData.publisher ?? "Sem informação"}</span>
                                </div>

                                <Separator className="my-4 bg-black dark:bg-primary" />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Idioma</span>

                                    <span>{bookData.language ?? "Sem informação"}</span>
                                </div>

                                <Separator className="my-4 bg-black dark:bg-primary" />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Páginas</span>

                                    <span>{bookData.pageCount ?? "Sem informação"}</span>
                                </div>

                                <Separator className="my-4 bg-black dark:bg-primary" />

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
