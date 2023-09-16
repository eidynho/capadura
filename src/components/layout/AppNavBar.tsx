"use client";

import { ElementType, Fragment } from "react";
import Link from "next/link";
import {
    BookMarked,
    BookOpen,
    CalendarClock,
    ChevronDown,
    ExternalLink,
    Hexagon,
    Home,
    List,
    LogOut,
    Menu,
    Moon,
    Newspaper,
    Settings,
    Sun,
    User,
    UserPlus,
} from "lucide-react";

import { useAuthContext } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";

import { ApplicationSearch } from "../ApplicationSearch";
import { LinkUnderline } from "../LinkUnderline";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

interface routeProps {
    name: string;
    path: string;
    disabled?: boolean;
    icon?: ElementType;
}

const mobileDropdownRoutes: routeProps[] = [
    {
        name: "Início",
        path: `/inicio`,
        icon: Home,
    },
    {
        name: "Livros",
        path: `/livros`,
        icon: BookOpen,
    },
];

export function AppNavBar() {
    const { user } = useAuthContext();
    const { theme, toggleTheme } = useThemeContext();

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
                  icon: BookMarked,
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
                  name: "Convide e ganhe",
                  path: "/convide-e-ganhe",
                  icon: UserPlus,
              },
              {
                  name: "Configurações",
                  path: `/@${user.username}/config`,
                  icon: Settings,
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

    return (
        <div className="fixed left-1/2 top-2 z-10 w-[calc(100%-16px)] max-w-5xl -translate-x-1/2 rounded-lg border bg-light/75 backdrop-blur-sm transition-colors dark:bg-dark/80">
            <nav className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-3 py-2 text-sm transition-colors">
                <div className="flex w-full items-center justify-between gap-1">
                    <div className="flex items-center gap-8">
                        <span className="mr-4 inline-block text-black dark:text-white">
                            Capadura
                        </span>

                        <div className="mr-8 hidden gap-8 text-black dark:text-white sm:flex">
                            <LinkUnderline href="/inicio" className="font-medium">
                                Início
                            </LinkUnderline>

                            <LinkUnderline href="/livros" className="font-medium">
                                Livros
                            </LinkUnderline>

                            <LinkUnderline href="/blog" className="font-medium">
                                <div className="flex items-center gap-2">
                                    Blog
                                    <ExternalLink size={14} className="text-muted-foreground" />
                                </div>
                            </LinkUnderline>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
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

                                        <ChevronDown size={14} className="text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    {routesTree(profileRoutes)}

                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger className="flex items-center gap-2">
                                            {theme === "light" && <Sun size={16} />}
                                            {theme === "dark" && <Moon size={16} />}
                                            Tema
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem
                                                    onClick={() => toggleTheme("light")}
                                                >
                                                    Claro
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => toggleTheme("dark")}
                                                >
                                                    Escuro
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>

                                    <DropdownMenuItem>
                                        <Link href="/sair" className="flex items-center gap-2">
                                            <LogOut size={16} />
                                            Sair
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button asChild size="sm" variant="outline">
                                    <Link href="/entrar">Entrar</Link>
                                </Button>
                                <Button asChild size="sm" variant="primary">
                                    <Link href="/criar-conta">Criar conta</Link>
                                </Button>
                            </div>
                        )}

                        <div className="block sm:hidden">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline" className="h-[42px]">
                                        <Menu size={16} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-36">
                                    {routesTree(mobileDropdownRoutes)}

                                    <DropdownMenuItem>
                                        <Link href="#" className="flex items-center gap-2">
                                            <Newspaper size={16} />
                                            Blog
                                        </Link>
                                        <DropdownMenuShortcut>
                                            <ExternalLink size={16} />
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
