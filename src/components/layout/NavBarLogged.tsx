"use client";

import { ElementType, Fragment, useContext, useEffect, useState } from "react";
import Link from "next/link";
import {
    BookOpen,
    CalendarClock,
    ChevronDown,
    Hexagon,
    List,
    LogOut,
    Settings,
    User,
    UserPlus,
} from "lucide-react";

import { AuthContext } from "@/contexts/AuthContext";

import { ApplicationSearch } from "../ApplicationSearch";
import { LinkUnderline } from "../LinkUnderline";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { ThemeToggler } from "../ThemeToggler";

interface routeProps {
    name: string;
    path: string;
    icon?: ElementType;
}

const navRoutes: routeProps[] = [
    {
        name: "Início",
        path: "/inicio",
    },
    {
        name: "Livros",
        path: "/livros",
    },
    {
        name: "Blog",
        path: "/blog",
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

    const profileRoutes: routeProps[] = user
        ? [
              {
                  name: "Perfil",
                  path: `/@${user.username}`,
                  icon: User,
              },
              {
                  name: "Minhas leituras",
                  path: `/@${user.username}/leituras`,
                  icon: BookOpen,
              },
              {
                  name: "Linha do tempo",
                  path: `/@${user.username}/linha-do-tempo`,
                  icon: CalendarClock,
              },
              {
                  name: "Minhas listas",
                  path: `/@${user.username}/listas`,
                  icon: List,
              },
              {
                  name: "Separator",
                  path: "",
              },
              {
                  name: "Seja membro",
                  path: "/seja-membro",
                  icon: Hexagon,
              },
              {
                  name: "Convidar amigos",
                  path: "/convidar-amigos",
                  icon: UserPlus,
              },
              {
                  name: "Configurações",
                  path: `/@${user.username}/config`,
                  icon: Settings,
              },
              {
                  name: "Sair",
                  path: "/sair",
                  icon: LogOut,
              },
          ]
        : [];

    function routesTree(routes: routeProps[]) {
        return (
            <>
                {routes.map(({ name, path, icon: Icon }) => (
                    <Fragment key={path}>
                        {name === "Separator" ? (
                            <DropdownMenuSeparator />
                        ) : (
                            <DropdownMenuItem asChild>
                                <Link href={path} className="flex items-center gap-2">
                                    {Icon && <Icon size={16} />}
                                    {name}
                                </Link>
                            </DropdownMenuItem>
                        )}
                    </Fragment>
                ))}
            </>
        );
    }

    if (!isMounted) return;

    return (
        <>
            {isMobile ? (
                <nav className="top-0 z-10 flex w-full items-center justify-between gap-2 border-b bg-light py-4 text-sm transition-colors dark:bg-dark">
                    <span className="ml-4 inline-block text-black dark:text-white">Contopia</span>
                </nav>
            ) : (
                <nav className="flex w-full items-center justify-center gap-2 border-b bg-light py-4 text-sm transition-colors dark:bg-dark">
                    <div className="max-w-7xl">
                        <div className="flex w-full items-center justify-between gap-1">
                            <span className="mr-4 inline-block text-black dark:text-white">
                                Contopia
                            </span>

                            <div className="mr-8 flex gap-8 text-black dark:text-white">
                                {navRoutes.map((item) => (
                                    <LinkUnderline href={item.path} className="font-medium">
                                        {item.name}
                                    </LinkUnderline>
                                ))}
                            </div>

                            <ApplicationSearch />

                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="sm" variant="outline">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={user.imageUrl} />
                                                <AvatarFallback>
                                                    {user.username[0].toUpperCase() || ""}
                                                </AvatarFallback>
                                            </Avatar>

                                            {user.username}

                                            <ChevronDown
                                                size={14}
                                                className="text-muted-foreground"
                                            />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        {routesTree(profileRoutes)}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button asChild size="sm" variant="outline">
                                        <Link href="/entrar">Entrar</Link>
                                    </Button>
                                    <Button asChild size="sm" variant="primary">
                                        <Link href="/cadastro">Criar conta</Link>
                                    </Button>
                                </div>
                            )}

                            <ThemeToggler />
                        </div>
                    </div>
                </nav>
            )}
        </>
    );
}
