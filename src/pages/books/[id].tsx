import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { getYear, isValid, parse } from "date-fns";
import { Clock, Image as ImageIcon, Heart, BookOpen } from "phosphor-react";
import { toast } from "react-toastify";

import { api } from "@/lib/api";

import { Container } from "@/components/layout/Container";
import { Title } from "@/components/Title";
import { Subtitle } from "@/components/Subtitle";
import { Separator } from "@/components/Separator";
import { Button } from "@/components/Button";
import { BookDataFromGoogle } from "@/components/layout/NavBarLogged";
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

const bookTabs = [
    {
        name: "Minha leitura",
        icon: <BookOpen size={20} />,
    },
    {
        name: "Avaliações",
        icon: <BookOpen size={20} />,
    },
    {
        name: "Livros recomendados",
        icon: <BookOpen size={20} />,
    },
];

export default function Book() {
    const router = useRouter();

    const [bookData, setBookData] = useState<BookData | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [currentTab, setCurrentTab] = useState(0);

    const [userReads, setUserReads] = useState<ReadData[] | null>(null);

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

                    console.log("data", data);

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

                    const userReadsResponse = await api.get(`/user-reads?bookId=${id}`);
                    setUserReads(userReadsResponse.data.items);
                }
            } catch (err) {
                toast.error("Erro ao carregar os dados do livro.");
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
                                <div className="h-96 w-full animate-pulse rounded-lg bg-gray-200 md:w-[19.5rem]"></div>
                            ) : (
                                <div className="flex w-full gap-6">
                                    {bookData?.image ? (
                                        <Image
                                            src={bookData.image}
                                            alt=""
                                            width={312}
                                            height={468}
                                            quality={100}
                                            priority={true}
                                            className="mx-auto rounded-lg"
                                        />
                                    ) : (
                                        <div className="flex h-96 w-full flex-col items-center justify-center rounded-md border border-black bg-gray-200 opacity-70">
                                            <ImageIcon size={40} />
                                            <span className="text-xs">Sem imagem</span>
                                        </div>
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
                                        <LinkUnderline href="" className="font-semibold">
                                            {bookData?.authors}
                                        </LinkUnderline>
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

                                    {/* Book action buttons */}
                                    <div className="flex w-full items-center gap-2">
                                        <Button size="sm">
                                            <Heart size={20} weight="bold" />
                                            <span className="font-medium">Curtir</span>
                                        </Button>
                                        <Button size="sm">
                                            <Clock size={20} weight="bold" />
                                            <span className="font-medium">Adicionar a lista</span>
                                        </Button>
                                    </div>

                                    {/* Book tabs */}
                                    <div className="border-b-2 border-gray-200">
                                        <ul className="-mb-px flex flex-wrap text-center text-sm font-medium text-gray-500">
                                            {bookTabs.map((item, index) => (
                                                <li
                                                    key={item.name}
                                                    onClick={() => setCurrentTab(index)}
                                                    className={`${
                                                        currentTab === index
                                                            ? "border-yellow-600 p-4 text-yellow-600"
                                                            : "border-transparent hover:border-gray-300 hover:text-gray-600"
                                                    } flex cursor-pointer gap-2 border-b-2 p-4 `}
                                                >
                                                    {item.icon}
                                                    {item.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {currentTab === 0 && (
                                        <ReadsProgress
                                            bookData={bookData}
                                            userReads={userReads}
                                            setUserReads={setUserReads}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}