"use client";

import { Fragment, ReactNode, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import {
    CaretDown,
    ClosedCaptioning,
    FolderUser,
    Gear,
    List,
    SignOut,
    User,
    UserPlus,
} from "phosphor-react";

import { AuthContext, signOut } from "@/contexts/AuthContext";

import { Separator } from "../Separator";
import { LinkUnderline } from "../LinkUnderline";
import { ApplicationSearch } from "../ApplicationSearch";

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

const navRoutes: routeProps[] = [
    {
        name: "Início",
        path: "/home",
    },
    {
        name: "Livros",
        path: "/livros",
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

export function NavBarLoggedComponent() {
    const [windowWidth, setWindowWidth] = useState(1024);
    const [isMounted, setIsMounted] = useState(false);

    const { user } = useContext(AuthContext);

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

    const profileRoutes: routeProps[] = [
        {
            name: "Perfil",
            path: `/usuario/${user?.username}`,
        },
        {
            name: "Livros",
            path: "/livros",
        },
        {
            name: "Linha do tempo",
            path: "/home",
        },
        {
            name: "Minhas listas",
            path: `/usuario/${user?.username}/listas`,
        },
        {
            name: "Separator",
            path: "",
        },
        {
            name: "Configurações",
            path: "/config",
        },
        {
            name: "Sair",
            path: "/home",
        },
    ];

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
                                    window.location.pathname === route.path
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

                                    <div className="w-96">
                                        <ApplicationSearch />
                                    </div>

                                    <Menu as="div" className="relative z-10 inline-block">
                                        <Menu.Button className="flex items-center gap-2 rounded-lg border border-black bg-white px-4 py-3 text-black transition-all hover:shadow-[0.25rem_0.25rem_#000]">
                                            <User size={20} />
                                            <span className="text-sm">{user?.username}</span>
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
