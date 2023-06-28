import { Fragment, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { format, getYear, isValid, parse, parseISO } from "date-fns";
import { toast } from "react-toastify";
import {
    Clock,
    Image as ImageIcon,
    Heart,
    Star,
    BookOpen,
    PlusCircle,
    User,
    DotsThreeVertical,
    LockSimple,
    LockSimpleOpen,
    ProhibitInset,
    Trash,
    PencilSimple,
} from "phosphor-react";

import { api } from "@/lib/api";
import { AuthContext } from "@/contexts/AuthContext";

import { Container } from "@/components/layout/Container";
import { Title } from "@/components/Title";
import { Subtitle } from "@/components/Subtitle";
import { Separator } from "@/components/Separator";
import { Button } from "@/components/Button";
import { BookDataFromGoogle } from "@/components/layout/NavBarLogged";
import { NewReadProgressDialog } from "@/components/dialogs/NewReadProgressDialog";
import { Menu, Transition } from "@headlessui/react";
import { UpdateReadProgressDialog } from "@/components/dialogs/UpdateReadProgressDialog";

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

export interface ReadData {
    id: string;
    book_id: string;
    start_date: Date | string;
    end_date: Date | string | null;
    is_private: boolean;
    review_content: string | null;
    review_rating: string | null;
    status: string;
    progress: {
        id: string;
        read_id: string;
        created_at: Date | string;
        description: string;
        is_spoiler: boolean;
        page: number | null;
        percentage: number | null;
    }[];
}

interface EditReadData {
    id: string;
    description: string;
    is_spoiler: boolean;
    page: number | null;
    countType: "page" | "percentage";
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
    const { user } = useContext(AuthContext);

    const [bookData, setBookData] = useState<BookData | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [currentTab, setCurrentTab] = useState(0);

    const [userReads, setUserReads] = useState<ReadData[] | null>(null);
    const [isOpenUpdateProgressDialog, setIsOpenUpdateProgressDialog] = useState(false);
    const [progressEditData, setProgressEditData] = useState<EditReadData | null>(null);

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

                    const userReadsResponse = await api.get(`/read/${id}`);
                    setUserReads(userReadsResponse.data);
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

    async function startNewRead() {
        try {
            await api.post("/read", {
                bookId: bookData?.id,
            });
        } catch (err) {
            toast.error("Erro ao iniciar a leitura, tente novamente mais tarde.");

            throw err;
        }
    }

    function editReadProgress({ id, description, is_spoiler, page, countType }: EditReadData) {
        setProgressEditData({
            id,
            description,
            is_spoiler,
            page,
            countType,
        });

        setIsOpenUpdateProgressDialog(true);
    }

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

    function readsProgress() {
        return (
            <div className="rounded-lg border border-black p-6 text-sm">
                <div className="flex flex-1 flex-col gap-2">
                    {userReads?.length ? (
                        userReads.map((read) => (
                            <Fragment key={read.id}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <User size={20} />
                                        <span>{user?.name}</span>
                                    </div>

                                    <Menu as="div" className="relative inline-block">
                                        <Menu.Button className="cursor-pointer rounded-lg p-1 text-sm hover:bg-gray-400/20">
                                            <DotsThreeVertical size={20} />
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
                                            <Menu.Items className="absolute right-0 z-10 mt-1 w-48 rounded-md border border-black bg-white py-2 shadow-[0.25rem_0.25rem_#000] ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <Menu.Item>
                                                    <div className="mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-lg border border-transparent py-2 pl-4 hover:bg-black hover:bg-opacity-10">
                                                        {read.is_private ? (
                                                            <>
                                                                <LockSimpleOpen
                                                                    size={16}
                                                                    weight="bold"
                                                                />
                                                                Tornar público
                                                            </>
                                                        ) : (
                                                            <>
                                                                <LockSimple
                                                                    size={16}
                                                                    weight="bold"
                                                                />
                                                                Tornar privado
                                                            </>
                                                        )}
                                                    </div>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <div className="mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-lg border border-transparent py-2 pl-4 hover:bg-black hover:bg-opacity-10">
                                                        <ProhibitInset size={18} weight="bold" />
                                                        Abandonar leitura
                                                    </div>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <div className="mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-lg border border-transparent py-2 pl-4 text-red-900 hover:bg-red-500 hover:bg-opacity-10">
                                                        <Trash size={18} weight="bold" />
                                                        Excluir
                                                    </div>
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>

                                <div className="mt-3 flex items-center">
                                    <div className="flex items-center gap-1 text-sm font-medium">
                                        <span>
                                            {read.progress[0]?.page ?? read.progress[0]?.percentage}
                                        </span>
                                    </div>
                                    <div className="relative mx-2 h-5 flex-1 overflow-hidden rounded border border-black bg-white dark:bg-gray-700">
                                        <div
                                            className="h-5 bg-pink-500"
                                            style={{
                                                width: `${read.progress[0]?.percentage}%` ?? 0,
                                            }}
                                        ></div>
                                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold">
                                            {`${read.progress[0]?.percentage}%`}
                                        </span>
                                    </div>
                                    <span className="w-8 text-sm font-medium">
                                        {bookData?.pageCount}
                                    </span>
                                </div>

                                <div className="text-sm">
                                    <span className="mr-1 font-semibold">Início da leitura:</span>
                                    <span>
                                        {format(parseISO(read.start_date.toString()), "dd/MM/yyyy")}
                                    </span>
                                </div>
                                {read.end_date && (
                                    <div className="text-sm">
                                        <span className="mr-1 font-semibold">Fim da leitura:</span>
                                        <span>
                                            {format(
                                                parseISO(read?.end_date.toString()),
                                                "dd/MM/yyyy",
                                            )}
                                        </span>
                                    </div>
                                )}

                                <div className="mt-4">
                                    {bookData && (
                                        <NewReadProgressDialog
                                            bookTitle={bookData?.title}
                                            bookPageCount={bookData?.pageCount ?? 0}
                                            readId={read.id}
                                        />
                                    )}
                                </div>
                                <div className="mt-2 flex flex-col gap-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="font-semibold">Últimos progressos</h4>
                                        <Button
                                            size="xs"
                                            className="bg-white text-black enabled:hover:bg-white enabled:hover:shadow-[0.125rem_0.125rem_#000]"
                                        >
                                            Ver todos
                                        </Button>
                                    </div>
                                    <div className="max-h-[32rem] min-h-[8rem] resize-y overflow-y-auto">
                                        {read.progress.map((progress) => (
                                            <div
                                                key={progress.id}
                                                className="border-t border-black p-4"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <User size={20} />
                                                        <span>{user?.name}</span>
                                                        <span className="mt-[2px] text-xs font-semibold text-gray-500">
                                                            {format(
                                                                parseISO(
                                                                    progress.created_at.toString(),
                                                                ),
                                                                "dd/MM/yyyy",
                                                            )}
                                                        </span>
                                                    </div>

                                                    <Menu
                                                        as="div"
                                                        className="relative inline-block"
                                                    >
                                                        <Menu.Button className="cursor-pointer rounded-lg p-1 text-sm hover:bg-gray-400/20">
                                                            <DotsThreeVertical size={20} />
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
                                                            <Menu.Items className="absolute right-0 z-10 mt-1 w-48 rounded-md border border-black bg-white py-2 shadow-[0.25rem_0.25rem_#000] ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                                <Menu.Item>
                                                                    <div
                                                                        onClick={() =>
                                                                            editReadProgress({
                                                                                ...progress,
                                                                                countType: "page",
                                                                            })
                                                                        }
                                                                        className="mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-lg border border-transparent py-2 pl-4 hover:bg-black hover:bg-opacity-10"
                                                                    >
                                                                        <PencilSimple
                                                                            size={18}
                                                                            weight="bold"
                                                                        />
                                                                        Editar
                                                                    </div>
                                                                </Menu.Item>
                                                                <Menu.Item>
                                                                    <div className="mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-lg border border-transparent py-2 pl-4 text-red-900 hover:bg-red-500 hover:bg-opacity-10">
                                                                        <Trash
                                                                            size={18}
                                                                            weight="bold"
                                                                        />
                                                                        Excluir
                                                                    </div>
                                                                </Menu.Item>
                                                            </Menu.Items>
                                                        </Transition>
                                                    </Menu>
                                                </div>

                                                {progress.description && (
                                                    <p className="mt-2">{progress.description}</p>
                                                )}

                                                <div className="mt-4 flex items-center">
                                                    <div className="flex items-center gap-1 text-sm font-medium">
                                                        <span>{progress.page}</span>
                                                    </div>
                                                    <div className="relative mx-2 h-5 flex-1 overflow-hidden rounded  border-black bg-white dark:bg-gray-700">
                                                        <div
                                                            className="h-5 bg-pink-500"
                                                            style={{
                                                                width:
                                                                    `${progress.percentage}%` ?? 0,
                                                            }}
                                                        ></div>
                                                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold">
                                                            {`${progress.percentage}%`}
                                                        </span>
                                                    </div>
                                                    <span className="w-8 text-sm font-medium">
                                                        {bookData?.pageCount}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}

                                        <UpdateReadProgressDialog
                                            isOpen={isOpenUpdateProgressDialog}
                                            setIsOpen={setIsOpenUpdateProgressDialog}
                                            userReads={userReads}
                                            setUserReads={setUserReads}
                                            readId={read.id}
                                            bookTitle={bookData?.title}
                                            bookPageCount={bookData?.pageCount ?? 0}
                                            editData={progressEditData}
                                        />
                                    </div>
                                </div>
                            </Fragment>
                        ))
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex w-full items-center justify-center gap-2">
                                <Button
                                    size="md"
                                    onClick={startNewRead}
                                    className="gap-3 bg-transparent disabled:border-black disabled:opacity-50"
                                >
                                    <PlusCircle size={34} />
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">Nova leitura</span>
                                        <span className="-mt-[2px] text-xs font-medium text-gray-500">
                                            Quero começar uma nova leitura
                                        </span>
                                    </div>
                                </Button>
                                <Button size="md" className="gap-3 bg-transparent">
                                    <BookOpen size={34} />
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">Avaliar</span>
                                        <span className="-mt-[2px] text-xs font-medium text-gray-500">
                                            Já finalizei a leitura e quero avaliar
                                        </span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
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

                            {/* Community rating */}
                            <div className="mt-3 flex flex-col justify-center rounded-lg border border-black px-4 pb-6 pt-4 text-sm">
                                <div className="my-1 flex items-center justify-between">
                                    <h3 className="font-semibold">Avaliações</h3>
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
                                    <div className="mx-2 h-5 flex-1 overflow-hidden rounded border border-black bg-white dark:bg-gray-700">
                                        <div className="h-5 w-[70%] rounded bg-yellow-500"></div>
                                    </div>
                                    <span className="w-8 text-sm font-medium">70%</span>
                                </div>
                                <div className="mt-4 flex items-center">
                                    <div className="flex items-center gap-1 text-sm font-medium">
                                        <span>4</span>
                                        <Star size={14} weight="fill" />
                                    </div>
                                    <div className="mx-2 h-5 flex-1 overflow-hidden rounded border border-black bg-white dark:bg-gray-700">
                                        <div className="h-5 w-[17%] rounded bg-yellow-500"></div>
                                    </div>
                                    <span className="w-8 text-sm font-medium">17%</span>
                                </div>
                                <div className="mt-4 flex items-center">
                                    <div className="flex items-center gap-1 text-sm font-medium">
                                        <span>3</span>
                                        <Star size={14} weight="fill" />
                                    </div>
                                    <div className="mx-2 h-5 flex-1 overflow-hidden rounded border border-black bg-white dark:bg-gray-700">
                                        <div className="h-5 w-[8%] rounded bg-yellow-500"></div>
                                    </div>
                                    <span className="w-8 text-sm font-medium">8%</span>
                                </div>
                                <div className="mt-4 flex items-center">
                                    <div className="flex items-center gap-1 text-sm font-medium">
                                        <span>2</span>
                                        <Star size={14} weight="fill" />
                                    </div>
                                    <div className="mx-2 h-5 flex-1 overflow-hidden rounded border border-black bg-white dark:bg-gray-700">
                                        <div className="h-5 w-[4%] rounded bg-yellow-500"></div>
                                    </div>
                                    <span className="w-8 text-sm font-medium">4%</span>
                                </div>
                                <div className="mt-4 flex items-center">
                                    <div className="flex items-center gap-1 text-sm font-medium">
                                        <span>1</span>
                                        <Star size={14} weight="fill" />
                                    </div>
                                    <div className="mx-2 h-5 flex-1 overflow-hidden rounded border border-black bg-white dark:bg-gray-700">
                                        <div className="h-5 w-[1%] rounded bg-yellow-500"></div>
                                    </div>
                                    <span className="w-8 text-sm font-medium">1%</span>
                                </div>
                            </div>
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
                                            <Heart size={20} />
                                            <span className="font-medium">Curtir</span>
                                        </Button>
                                        <Button size="sm">
                                            <Clock size={20} />
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

                                    {currentTab === 0 && readsProgress()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
