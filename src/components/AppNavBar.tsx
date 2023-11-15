"use client";

import { ElementType, Fragment, useEffect, useState } from "react";
import Link from "next/link";
import {
    BookMarked,
    ChevronDown,
    Hexagon,
    Home,
    List,
    LogOut,
    Menu,
    Moon,
    Settings,
    Star,
    Sun,
    ThumbsUp,
    User,
    UserPlus,
} from "lucide-react";

import { useAuthContext } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";

import { ApplicationSearch } from "./ApplicationSearch";
import { SignOutDialog } from "./SignOutDialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
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
];

export function AppNavBar() {
    const [mounted, setMounted] = useState(false);
    const [openSignOutDialog, setOpenSignOutDialog] = useState(false);

    const { user, isFetchingCurrentUser } = useAuthContext();
    const { theme, toggleTheme } = useThemeContext();

    useEffect(() => {
        setMounted(true);
    }, []);

    const profileRoutes: routeProps[] = user
        ? [
              {
                  name: "Perfil",
                  path: `/@${user.username}`,
                  icon: User,
              },
              {
                  name: "Leituras",
                  path: `/@${user.username}/leituras`,
                  icon: BookMarked,
              },
              {
                  name: "Avaliações",
                  path: `/@${user.username}/avaliacoes`,
                  icon: Star,
              },
              {
                  name: "Curtidas",
                  path: `/@${user.username}/curtidas`,
                  icon: ThumbsUp,
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
                  disabled: true,
                  icon: Hexagon,
              },
              {
                  name: "Convide e ganhe",
                  path: "/convide-e-ganhe",
                  disabled: true,
                  icon: UserPlus,
              },
              {
                  name: "Configurações",
                  path: `/config`,
                  icon: Settings,
              },
          ]
        : [];

    if (!mounted) return;

    function toggleSignOutDialog(value: boolean) {
        setOpenSignOutDialog(value);
    }

    function RoutesTree({ routes }: { routes: routeProps[] }) {
        return (
            <>
                {routes.map(({ name, path, disabled, icon: Icon }) => (
                    <Fragment key={path}>
                        {name === "Separator" ? (
                            <DropdownMenuSeparator />
                        ) : (
                            <DropdownMenuItem asChild disabled={disabled}>
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

    if (isFetchingCurrentUser) {
        return (
            <div className="fixed left-1/2 top-2 z-50 flex h-[3.75rem] w-[calc(100%-16px)] max-w-5xl -translate-x-1/2 animate-pulse items-center justify-between rounded-lg border bg-light/75 px-3 py-4 backdrop-blur-sm transition-colors dark:bg-dark/80">
                <div className="h-6 w-24 rounded-md bg-zinc-300"></div>

                <div className="flex items-center gap-2">
                    <div className="h-10 w-11 rounded-md bg-zinc-300 md:w-40"></div>
                    <div className="h-10 w-28 rounded-md bg-zinc-300"></div>
                    <div className="block h-10 w-11 rounded-md bg-zinc-300 md:hidden"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed left-1/2 top-2 z-50 w-[calc(100%-16px)] max-w-5xl -translate-x-1/2 rounded-lg border bg-light/75 backdrop-blur-sm transition-colors dark:bg-dark/80">
            <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-3 py-2 text-sm transition-colors">
                <div className="flex w-full items-center justify-between gap-1">
                    <div className="flex items-center gap-8">
                        <Link
                            href={user ? "/inicio" : "/"}
                            className="inline-block text-black dark:text-white md:mr-4"
                        >
                            Capadura
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <ApplicationSearch />

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage
                                                src={user.imageUrl}
                                                width={24}
                                                height={24}
                                                loading="eager"
                                                alt={`Foto de perfil de ${user.username}`}
                                                title={`Foto de perfil de ${user.username}`}
                                            />
                                            <AvatarFallback>
                                                {user.username[0].toUpperCase() || ""}
                                            </AvatarFallback>
                                        </Avatar>

                                        <span className="max-w-[80px] truncate">
                                            {user.username}
                                        </span>

                                        <ChevronDown size={14} className="text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <RoutesTree routes={profileRoutes} />

                                    <DropdownMenuItem
                                        onClick={() => setOpenSignOutDialog(true)}
                                        className="flex items-center gap-2"
                                    >
                                        <LogOut size={16} />
                                        Sair
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

                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => toggleTheme(theme === "dark" ? "light" : "dark")}
                            className="hidden h-[42px] md:flex"
                        >
                            {theme === "light" && <Sun size={16} />}
                            {theme === "dark" && <Moon size={16} />}
                        </Button>

                        <div className="block md:hidden">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline" className="h-[42px]">
                                        <Menu size={16} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-36">
                                    {user && <RoutesTree routes={mobileDropdownRoutes} />}

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
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>

            <SignOutDialog open={openSignOutDialog} onOpenChange={toggleSignOutDialog} />
        </div>
    );
}
