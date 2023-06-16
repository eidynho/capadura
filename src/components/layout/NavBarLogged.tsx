import { Fragment, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    ClosedCaptioning,
    Coins,
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

import { signOut } from "@/contexts/AuthContext";

import { Separator } from "../Separator";
import Link from "next/link";
import { ButtonLink } from "../ButtonLink";
import { Menu, Transition } from "@headlessui/react";
import { InputText, InputTextSearch } from "../InputText";
import { Button } from "../Button";
import { useDebounce } from "@/hooks/useDebounce";
import axios from "axios";
import Image from "next/image";
import useDidMountEffect from "@/hooks/useDidMountEffect";

const activeRouteStyles = "bg-yellow-500 border border-t-black border-b-black border-l-black border-r-yellow-500";
const notActiveRouteStyles = "border border-transparent hover:bg-yellow-600 hover:bg-opacity-20";

interface routeProps {
    name: string;
    icon: ReactNode;
    path: string;
    executeOnClick?: () => void;
}

const transcriptionRoutes: routeProps[] = [
    {
        name: "Transcrever",
        icon: <ClosedCaptioning size={20} />,
        path: "/app/transcribe",
    },
    {
        name: "Minhas transcrições",
        icon: <FolderUser size={20} />,
        path: "/app/my-transcriptions",
    },
];

const settingsRoutes: routeProps[] = [
    {
        name: "Convidar amigos",
        icon: <UserPlus size={20} />,
        path: "/app/invite-friends",
    },
    {
        name: "Gerenciar conta",
        icon: <Gear size={20} />,
        path: "/app/settings",
    },
    {
        name: "Sair",
        icon: <SignOut size={20} />,
        path: "/login",
        executeOnClick: signOut,
    },
];

interface BookData {
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
        imageLinks: {
            smallThumbnail: string;
            thumbnail: string;
        };
        language: string;
    };
    searchInfo: {
        textSnippet: string;
    };
}

export interface GoogleAPIData {
    items: BookData[];
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

    const router = useRouter();

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);

        setIsMounted(true);

        return () => {
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
                    <Link
                        onClick={route.executeOnClick}
                        key={route.path}
                        href={route.path}
                        className={`${
                            router.pathname === route.path ? activeRouteStyles : notActiveRouteStyles
                        } rounded-l-full flex items-center gap-2 py-3 pl-8 ml-5 mb-1 select-none cursor-pointer`}
                    >
                        {route.icon}
                        {route.name}
                    </Link>
                ))}
            </>
        );
    }

    function booksSearchSugestion() {
        return (
            <div className="absolute top-10 left-0 bg-white text-black border border-black rounded-b-lg w-[32rem] pt-3 pb-2">
                {isLoadingBooks ? (
                    [...Array(3)].map((_, index) => (
                        <div key={index} className="animate-pulse mb-3 flex items-center gap-4">
                            <div className="mx-3 bg-gray-200 w-12 h-16 rounded-lg"></div>
                            <div className="flex flex-col gap-2">
                                <div className="bg-gray-200 w-32 h-4 rounded-lg"></div>
                                <div className="bg-gray-200 w-48 h-4 rounded-lg"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        {books.items && books.items.length ? (
                            <>
                                <h2 className="px-4 mb-2 text-xl font-medium">Livros</h2>
                                <div className="flex flex-col">
                                    {books.items.map((book) => (
                                        <div
                                            key={book.id}
                                            className="py-2 px-4 flex gap-4 cursor-pointer hover:bg-black hover:text-white"
                                        >
                                            <div className="w-12 h-16 overflow-hidden border border-black rounded-lg">
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
                                                    <div className="h-full flex items-center justify-center">
                                                        <ImageIcon size={42} weight="bold" className="text-gray-500" />
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h2 className="line-clamp-1" title={book.volumeInfo.title}>
                                                        {book.volumeInfo.title}
                                                    </h2>
                                                    <span className="text-xs text-gray-500">
                                                        {book.volumeInfo.publishedDate &&
                                                            book.volumeInfo.publishedDate.split("-")[0]}
                                                    </span>
                                                </div>
                                                <span className="flex items-center gap-2 text-sm">
                                                    <User size={18} />
                                                    {book.volumeInfo.authors?.[0]}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <span className="inline-block px-4 pb-2">Nenhum resultado encontrado.</span>
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
                        <nav className="text-sm fixed z-10 top-0 w-full py-4 flex items-center justify-between gap-2 bg-primary border-b border-black">
                            <span className="inline-block ml-4">Contopia</span>
                            <Menu as="div" className="relative inline-block mr-4">
                                <div>
                                    <Menu.Button className="inline-flex w-full justify-center rounded-md text-black p-3 text-sm font-medium hover:bg-yellow-600 hover:bg-opacity-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-opacity-75">
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
                                    <Menu.Items className="absolute -right-5 mt-4 py-6 w-80 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <Menu.Item>{routesTree(transcriptionRoutes)}</Menu.Item>

                                        <Separator customStyles="ml-6" />

                                        <Menu.Item>{routesTree(settingsRoutes)}</Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </nav>
                    ) : (
                        <nav className="text-sm fixed z-10 top-0 w-full py-4 flex items-center justify-center gap-2 bg-primary border-b border-black">
                            <div className="w-full max-w-7xl flex items-center justify-center gap-3">
                                <span className="inline-block ml-4">Contopia</span>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <MagnifyingGlass size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        id="nav-search"
                                        onChange={(e) => setSearchName(e.target.value)}
                                        value={searchName}
                                        placeholder="Busque por título, autor, editora, ISBN..."
                                        className="block py-3 pl-10 pr-10 text-sm border border-black rounded-lg w-[32rem] outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                    />
                                    {searchName && (
                                        <div
                                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                            onClick={() => setSearchName("")}
                                        >
                                            <X size={18} />
                                        </div>
                                    )}

                                    {debouncedSearchName && booksSearchSugestion()}
                                </div>
                                <Button size="md" className="bg-white text-black">
                                    <User size={20} />
                                </Button>
                            </div>
                        </nav>
                    )}
                </>
            )}
        </>
    );
}
