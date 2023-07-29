import { Fragment, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import { getYear, isValid, parse } from "date-fns";
import { Clock, Image as ImageIcon, Heart } from "phosphor-react";
import { toast } from "react-toastify";

import { api } from "@/lib/api";
import { AuthContext } from "@/contexts/AuthContext";

import { Container } from "@/components/layout/Container";
import { Title } from "@/components/Title";
import { Subtitle } from "@/components/Subtitle";
import { Separator } from "@/components/Separator";
import { Button } from "@/components/Button";
import { BookDataFromGoogle } from "@/components/ApplicationSearch";
import { ReadsProgress } from "@/components/ReadsProgress";
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

interface LikeBook {
    id: string;
    bookId: string;
    userId: string;
}

export default function Book() {
    const router = useRouter();

    const { user } = useContext(AuthContext);

    const [isMounted, setIsMounted] = useState(false);
    const [like, setLike] = useState<LikeBook | null>(null);
    const [bookData, setBookData] = useState<BookData | null>(null);

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
            toast.error("Erro ao carregar os dados do livro.");
            throw err;
        }
    }

    useEffect(() => {
        if (!router.isReady) return;

        async function fetchBookFromDatabase() {
            setIsMounted(false);

            try {
                const { data } = await api.get<BookData>(`/book/${router.query.id}`);

                if (!data) {
                    await fetchBookFromGoogle();
                    setLike(null);
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

                    if (!user) return;
                    const userLikeResponse = await api.get(`/likes/book/${id}/user/${user.id}`);
                    setLike(userLikeResponse.data.like);
                }
            } catch (err) {
                toast.error("Erro ao carregar os dados do livro.");
                throw err;
            } finally {
                setIsMounted(true);
            }
        }

        fetchBookFromDatabase();
    }, [router.isReady, router.query.id, user]);

    async function handleToggleLikeBook() {
        const isLiked = !!like;

        try {
            if (isLiked) {
                await api.delete(`/likes/${like.id}`);
                setLike(null);
            } else {
                if (!bookData?.id) {
                    throw new Error("Book data not provided.");
                }

                if (!user?.id) {
                    throw new Error("User is not logged in.");
                }

                const { data } = await api.post("/likes", {
                    bookId: bookData.id,
                    userId: user.id,
                });

                setLike(data.like);
            }
        } catch (err) {
            const message = isLiked ? "descurtir" : "curtir";

            toast.error(`Não foi possível ${message} o livro.`);
            throw err;
        }
    }

    function bookHeader() {
        return (
            <div className="mb-3 flex flex-col items-center gap-2 md:items-start">
                {!isMounted ? (
                    <>
                        <div className="h-9 w-64 rounded-md bg-gray-200"></div>
                        <div className="h-6 w-80 rounded-md bg-gray-200"></div>
                        <div className="my-2 h-6 w-56 rounded-md bg-gray-200"></div>
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

    // render loading
    if (!isMounted) {
        return (
            <Container>
                <div className="mt-5 flex animate-pulse flex-col justify-center">
                    <div className="flex flex-col">
                        <div className="flex flex-col items-start justify-center gap-8 md:flex-row">
                            <div className="w-full md:w-[19.5rem]">
                                {/* Book header */}
                                <div className="block md:hidden">{bookHeader()}</div>

                                {/* Book image */}
                                <div className="h-96 w-full rounded-lg bg-gray-200 md:w-[19.5rem]"></div>

                                {/* Book data */}
                                <div className="mt-3 rounded-lg border border-gray-200 pb-4">
                                    <div className="mx-4 mt-4 flex justify-between text-sm">
                                        <div className="h-5 w-24 rounded-md bg-gray-200"></div>

                                        <div className="h-5 w-16 rounded-md bg-gray-200"></div>
                                    </div>

                                    <Separator className="border-gray-200" />

                                    <div className="mx-4 flex justify-between text-sm">
                                        <div className="h-5 w-32 rounded-md bg-gray-200"></div>

                                        <div className="w-16 rounded-md bg-gray-200"></div>
                                    </div>

                                    <Separator className="border-gray-200" />

                                    <div className="mx-4 flex justify-between text-sm">
                                        <div className="h-5 w-20 rounded-md bg-gray-200"></div>

                                        <div className="w-16 rounded-md bg-gray-200"></div>
                                    </div>

                                    <Separator className="border-gray-200" />

                                    <div className="mx-4 flex justify-between text-sm">
                                        <div className="h-5 w-16 rounded-md bg-gray-200"></div>

                                        <div className="w-16 rounded-md bg-gray-200"></div>
                                    </div>

                                    <Separator className="border-gray-200" />

                                    <div className="mx-4 flex justify-between text-sm">
                                        <div className="h-5 w-20 rounded-md bg-gray-200"></div>

                                        <div className="w-16 rounded-md bg-gray-200"></div>
                                    </div>
                                </div>

                                {/* Community rating */}
                                <div className="mt-4 h-40 w-full items-center rounded-lg bg-gray-200"></div>
                            </div>

                            <div className="flex w-full flex-col md:w-[calc(100%-344px)]">
                                {/* Book header */}
                                <div className="hidden md:block">{bookHeader()}</div>

                                <div className="flex w-full flex-col gap-8 xl:flex-row">
                                    <div className="flex w-full flex-col gap-2">
                                        {/* Book content */}
                                        <div className="h-4 w-full items-center rounded-lg bg-gray-200"></div>
                                        <div className="h-4 w-2/3 items-center rounded-lg bg-gray-200"></div>

                                        <div className="mt-2 h-4 w-full items-center rounded-lg bg-gray-200"></div>
                                        <div className="h-4 w-full items-center rounded-lg bg-gray-200"></div>
                                        <div className="h-4 w-full items-center rounded-lg bg-gray-200"></div>
                                        <div className="h-4 w-1/3 items-center rounded-lg bg-gray-200"></div>

                                        <div className="mt-2 h-4 w-full items-center rounded-lg bg-gray-200"></div>
                                        <div className="h-4 w-full items-center rounded-lg bg-gray-200"></div>
                                        <div className="h-4 w-2/5 items-center rounded-lg bg-gray-200"></div>

                                        {/* Book action buttons */}
                                        <div className="mt-2 flex w-full items-center gap-2">
                                            <div className="h-9 w-24 items-center rounded-lg bg-gray-200"></div>
                                            <div className="h-9 w-40 items-center rounded-lg bg-gray-200"></div>
                                        </div>

                                        {/* Book tabs */}
                                        <div className="mt-4 w-full items-center rounded-lg border border-gray-200 p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 items-center rounded-full bg-gray-200"></div>
                                                    <div className="h-6 w-40 items-center rounded-lg bg-gray-200"></div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-24 items-center rounded-lg bg-gray-200"></div>
                                                    <div className="h-6 w-20 items-center rounded-lg bg-gray-200"></div>
                                                </div>
                                            </div>

                                            <div className="mt-2 h-4 w-48 items-center rounded-lg bg-gray-200"></div>

                                            <div className="mt-6 h-5 w-40 items-center rounded-lg bg-gray-200"></div>

                                            {Array.from({ length: 3 }, (_, index) => (
                                                <Fragment key={index}>
                                                    <Separator className="border-gray-200" />

                                                    <div className="flex flex-col px-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-8 w-8 items-center rounded-full bg-gray-200"></div>
                                                                <div className="h-6 w-40 items-center rounded-lg bg-gray-200"></div>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <div className="h-6 w-6 items-center rounded-lg bg-gray-200"></div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-6 h-4 w-2/3 items-center rounded-lg bg-gray-200"></div>
                                                        <div className="mt-4 h-6 w-full items-center rounded-lg bg-gray-200"></div>
                                                    </div>
                                                </Fragment>
                                            ))}
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
                                {bookData?.image ? (
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
                                        {bookData?.authors}
                                    </LinkUnderline>
                                </div>

                                <Separator />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Ano de publicação</span>
                                    <span>
                                        {bookData?.publishDate
                                            ? getYear(new Date(bookData.publishDate))
                                            : "Sem informação"}
                                    </span>
                                </div>

                                <Separator />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Editora</span>

                                    <span>{bookData?.publisher ?? "Sem informação"}</span>
                                </div>

                                <Separator />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Idioma</span>

                                    <span>{bookData?.language ?? "Sem informação"}</span>
                                </div>

                                <Separator />

                                <div className="mx-4 flex justify-between text-sm">
                                    <span className="font-semibold">Páginas</span>

                                    <span>{bookData?.pageCount ?? "Sem informação"}</span>
                                </div>

                                <Separator />

                                {/* Book action buttons */}
                                <div className="flex w-full items-center justify-center gap-2">
                                    <Button size="sm">
                                        <Clock size={20} />
                                        <span className="font-medium">Adicionar a lista</span>
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleToggleLikeBook}
                                        className={`${
                                            like
                                                ? "bg-pink-500 text-black enabled:hover:bg-pink-500"
                                                : ""
                                        }`}
                                    >
                                        <Heart size={20} />
                                        <span className="font-medium">
                                            {like ? "Curtido" : "Curtir"}
                                        </span>
                                    </Button>
                                </div>
                            </div>

                            {/* Community rating */}
                            {bookData?.id && <RatingChart bookId={bookData.id} />}
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
                                            __html: bookData?.description ?? "",
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
