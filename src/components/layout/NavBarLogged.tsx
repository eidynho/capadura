import { Fragment, ReactNode, useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import { Menu, Transition } from "@headlessui/react";
import {
    CaretDown,
    ClosedCaptioning,
    FolderUser,
    Gear,
    Image as ImageIcon,
    List,
    MagnifyingGlass,
    SignOut,
    User,
    UserPlus,
    X,
} from "phosphor-react";

import { AuthContext, signOut } from "@/contexts/AuthContext";

import { useDebounce } from "@/hooks/useDebounce";
import useDidMountEffect from "@/hooks/useDidMountEffect";
import { Separator } from "../Separator";
import { LinkUnderline } from "../LinkUnderline";

const activeRouteStyles = "bg-black text-white border border-black";
const notActiveRouteStyles = "border border-transparent hover:bg-black hover:bg-opacity-10";

interface routeProps {
    name: string;
    icon?: ReactNode;
    path: string;
    executeOnClick?: () => void;
}

const transcriptionRoutes: routeProps[] = [
    {
        name: "Transcrever",
        icon: <ClosedCaptioning size={20} />,
        path: "/me",
    },
    {
        name: "Minhas transcrições",
        icon: <FolderUser size={20} />,
        path: "/my-transcriptions",
    },
];

const settingsRoutes: routeProps[] = [
    {
        name: "Convidar amigos",
        icon: <UserPlus size={20} />,
        path: "/invite-friends",
    },
    {
        name: "Gerenciar conta",
        icon: <Gear size={20} />,
        path: "/settings",
    },
    {
        name: "Sair",
        icon: <SignOut size={20} />,
        path: "/login",
        executeOnClick: signOut,
    },
];

const profileRoutes: routeProps[] = [
    {
        name: "Perfil",
        path: "/me",
    },
    {
        name: "Livros",
        path: "/home",
    },
    {
        name: "Linha do tempo",
        path: "/home",
    },
    {
        name: "Minhas listas",
        path: "/home",
    },
    {
        name: "Separator",
        path: "",
    },
    {
        name: "Configurações",
        path: "/home",
    },
    {
        name: "Sair",
        path: "/home",
    },
];

const navRoutes: routeProps[] = [
    {
        name: "Início",
        path: "/home",
    },
    {
        name: "Livros",
        path: "/home",
    },
    {
        name: "Autores",
        path: "/home",
    },
    {
        name: "Editoras",
        path: "/home",
    },
    {
        name: "Trocas",
        path: "/home",
    },
    {
        name: "Blog",
        path: "/home",
    },
    {
        name: "Convidar amigos",
        path: "/home",
    },
    {
        name: "Seja membro",
        path: "/home",
    },
];

export interface BookDataFromGoogle {
    kind: string;
    id: string;
    etag: string;
    selfLink: string;
    volumeInfo: {
        title: string;
        subtitle: string;
        authors: string[];
        publisher: string;
        publishedDate: string;
        description: string;
        industryIdentifiers: {
            type: string;
            identifier: string;
        }[];
        pageCount: number;
        categories: string[];
        averageRating?: number;
        ratingsCount?: number;
        maturityRating: string;
        imageLinks?: {
            smallThumbnail?: string;
            thumbnail?: string;
            small?: string;
            medium?: string;
            large?: string;
            extraLarge?: string;
        };
        language: string;
    };
    searchInfo: {
        textSnippet: string;
    };
}

export interface GoogleAPIData {
    items: BookDataFromGoogle[];
    totalItems: number;
}

export function NavBarLoggedComponent() {
    const [windowWidth, setWindowWidth] = useState(1024);
    const [isMounted, setIsMounted] = useState(false);

    const [books, setBooks] = useState<GoogleAPIData>({
        items: [],
        totalItems: 0,
    });
    const [searchName, setSearchName] = useState("");
    const [isLoadingBooks, setIsLoadingBooks] = useState(false);
    const debouncedSearchName = useDebounce<string>(searchName, 500);

    const { user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        let timeoutId: any;

        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setWindowWidth(window.innerWidth);
            }, 400);
        };

        setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);

        setIsMounted(true);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    const isMobile = windowWidth < 1024;

    useDidMountEffect(() => {
        if (!debouncedSearchName) return;

        const getBooks = async () => {
            setIsLoadingBooks(true);
            try {
                const query = [];

                query.push("q=" + `"${debouncedSearchName}"`);
                query.push("langRestrict=" + "pt-BR");
                query.push("maxResults=" + 8);
                query.push("startIndex=" + 0);
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
                toast.error("Erro ao carregar livros.");
                throw err;
            } finally {
                setIsLoadingBooks(false);
            }
        };
        getBooks();
    }, [debouncedSearchName]);

    function routesTree(routes: routeProps[]) {
        return (
            <>
                {routes.map((route) => (
                    <Fragment key={route.name}>
                        {route.name === "Separator" ? (
                            <Separator className="mx-5 border-black" />
                        ) : (
                            <Link
                                onClick={route.executeOnClick}
                                key={route.path}
                                href={route.path}
                                className={`${
                                    router.pathname === route.path
                                        ? activeRouteStyles
                                        : notActiveRouteStyles
                                } mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-lg py-2 pl-4`}
                            >
                                {route.name}
                            </Link>
                        )}
                    </Fragment>
                ))}
            </>
        );
    }

    function booksSearchSugestion() {
        return (
            <div className="absolute left-0 top-10 z-10 w-[32rem] rounded-b-lg border border-black bg-white pb-2 pt-3 text-black">
                {isLoadingBooks ? (
                    [...Array(3)].map((_, index) => (
                        <div key={index} className="mb-3 flex animate-pulse items-center gap-4">
                            <div className="mx-3 h-16 w-12 rounded-lg bg-gray-200"></div>
                            <div className="flex flex-col gap-2">
                                <div className="h-4 w-32 rounded-lg bg-gray-200"></div>
                                <div className="h-4 w-48 rounded-lg bg-gray-200"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        {books.items && books.items.length ? (
                            <>
                                <h2 className="mb-2 px-4 text-xl font-medium">Livros</h2>
                                <div className="flex flex-col">
                                    {books.items.map((book) => (
                                        <Link
                                            href={`/books/${book.id}`}
                                            onClick={() => setSearchName("")}
                                            key={book.id}
                                            className="flex cursor-pointer gap-4 px-4 py-2 hover:bg-black hover:text-white"
                                        >
                                            <div className="h-16 w-12 overflow-hidden rounded-lg border border-black">
                                                {book.volumeInfo.imageLinks?.thumbnail ? (
                                                    <Image
                                                        src={book.volumeInfo.imageLinks?.thumbnail?.replace(
                                                            "edge=curl",
                                                            "",
                                                        )}
                                                        alt=""
                                                        width={48}
                                                        height={64}
                                                        quality={75}
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

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h2
                                                        className="line-clamp-1"
                                                        title={book.volumeInfo.title}
                                                    >
                                                        {book.volumeInfo.title}
                                                    </h2>
                                                    <span className="text-xs text-gray-500">
                                                        {book.volumeInfo.publishedDate &&
                                                            book.volumeInfo.publishedDate.split(
                                                                "-",
                                                            )[0]}
                                                    </span>
                                                </div>
                                                <span className="flex items-center gap-2 text-sm">
                                                    <User size={18} />
                                                    {book.volumeInfo.authors?.[0]}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <span className="inline-block px-4 pb-2">
                                Nenhum resultado encontrado.
                            </span>
                        )}
                    </>
                )}
            </div>
        );
    }

    return (
        <>
            {isMounted && (
                <>
                    {isMobile ? (
                        <nav className="top-0 z-10 flex w-full items-center justify-between gap-2 border-b border-black bg-primary py-4 text-sm">
                            <span className="ml-4 inline-block">Contopia</span>
                            <Menu as="div" className="relative mr-4 inline-block">
                                <div>
                                    <Menu.Button className="inline-flex w-full justify-center rounded-md p-3 text-sm font-medium text-black hover:bg-yellow-600 hover:bg-opacity-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-opacity-75">
                                        <List size={24} />
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute -right-5 mt-4 w-80 rounded-md bg-white py-6 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <Menu.Item>{routesTree(transcriptionRoutes)}</Menu.Item>

                                        <Menu.Item>{routesTree(settingsRoutes)}</Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </nav>
                    ) : (
                        <nav className="flex w-full items-center justify-center gap-2 border-b border-black bg-primary py-4 text-sm">
                            <div className="max-w-7xl">
                                <div className="flex w-full items-center justify-between gap-4">
                                    <span className="inline-block">Contopia</span>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <MagnifyingGlass size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            id="nav-search"
                                            onChange={(e) => setSearchName(e.target.value)}
                                            value={searchName}
                                            placeholder="Busque por título, autor, editora, ISBN..."
                                            className="block w-[32rem] rounded-lg border border-black py-3 pl-10 pr-10 text-sm outline-none focus:border-yellow-500"
                                        />
                                        {searchName && (
                                            <div
                                                className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                                                onClick={() => setSearchName("")}
                                            >
                                                <X size={18} />
                                            </div>
                                        )}

                                        {debouncedSearchName && booksSearchSugestion()}
                                    </div>

                                    <Menu as="div" className="relative z-10 inline-block">
                                        <Menu.Button className="flex items-center gap-2 rounded-lg border border-black bg-white px-4 py-3 text-black transition-all hover:shadow-[0.25rem_0.25rem_#000]">
                                            <User size={20} />
                                            <span className="text-sm">
                                                {user?.name.split(" ")[0]}
                                            </span>
                                            <CaretDown size={14} />
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
                                            <Menu.Items className="absolute right-0 mt-1 w-48 rounded-md border border-black bg-white py-2 shadow-[0.25rem_0.25rem_#000] ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <Menu.Item>{routesTree(profileRoutes)}</Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>

                                <div className="text-md mb-1 mt-4 flex items-center justify-between text-sm font-medium">
                                    {navRoutes.map((item) => (
                                        <LinkUnderline href={item.path} className="font-medium">
                                            {item.name}
                                        </LinkUnderline>
                                    ))}
                                </div>
                            </div>
                        </nav>
                    )}
                </>
            )}
        </>
    );
}
