"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { isValid, parse } from "date-fns";
import { ImageOff } from "lucide-react";
import { toast } from "react-toastify";

import { BookDataFromGoogle } from "@/components/ApplicationSearch";
import { ReadStatus } from "@/endpoints/mutations/readsMutations";

import { useFetchBook } from "@/endpoints/queries/booksQueries";
import { useCreateBook, useUpdateBookImage } from "@/endpoints/mutations/booksMutations";

import Loading from "./loading";
import { BookGradient } from "./components/BookGradient";
import { BookHeader } from "./components/BookHeader";
import { BookMetaData } from "./components/BookMetaData";
import { Container } from "@/components/layout/Container";
import { RatingChart } from "@/components/RatingChart";
import { ReadsProgress } from "./components/Read";

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
    status: ReadStatus;
    progress: ProgressData[];
    book?: BookData;
}

interface BookProps {
    params: {
        id: string;
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

    return (
        <Container>
            <BookGradient bookImageUrl={bookFetchedFromDb?.imageUrl} />

            <div className="mt-5 flex flex-col items-start justify-center gap-8 md:flex-row">
                <div className="z-10 w-full md:w-[19.5rem]">
                    {/* Book header */}
                    <BookHeader
                        title={bookData.title}
                        subtitle={bookData.subtitle}
                        device="mobile"
                    />

                    {/* Book image */}
                    <div className="flex w-full gap-6">
                        <canvas id="canvas" className="hidden"></canvas>
                        {bookData.imageUrl ? (
                            <Image
                                id="book-principal-image"
                                src={bookData.imageUrl}
                                width={312}
                                height={468}
                                quality={100}
                                loading="eager"
                                priority
                                alt={`Capa do livro ${bookData.title}`}
                                title={`Capa do livro ${bookData.title}`}
                                className="mx-auto rounded-md"
                            />
                        ) : (
                            <div className="flex h-96 w-full flex-col items-center justify-center rounded-md border bg-zinc-500/10 opacity-75">
                                <ImageOff size={36} strokeWidth={1.6} />
                                <span className="mt-1 text-sm font-medium text-muted-foreground">
                                    Sem imagem
                                </span>
                            </div>
                        )}
                    </div>

                    <BookMetaData bookData={bookData} />

                    {/* Community rating */}
                    <RatingChart bookId={bookData.id} />
                </div>

                <div className="z-10 flex w-full flex-col md:w-[calc(100%-344px)]">
                    {/* Book header */}
                    <BookHeader
                        title={bookData.title}
                        subtitle={bookData.subtitle}
                        device="desktop"
                    />

                    <div className="flex w-full flex-col gap-8 xl:flex-row">
                        <div className="flex w-full flex-col gap-2">
                            {/* Book content */}
                            <p
                                className="text-justify text-sm leading-7 text-black dark:text-muted-foreground"
                                dangerouslySetInnerHTML={{
                                    __html: bookData.description ?? "",
                                }}
                            ></p>

                            <ReadsProgress bookData={bookData} />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
