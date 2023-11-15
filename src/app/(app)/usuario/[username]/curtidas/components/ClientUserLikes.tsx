"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { ImageIcon, MoreHorizontal } from "lucide-react";

import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";
import { publishDateFormat } from "@/utils/publish-date-format";

import { useAuthContext } from "@/contexts/AuthContext";
import { useFetchUserByUsername } from "@/endpoints/queries/usersQueries";
import { useGetBookLikesByUser } from "@/endpoints/queries/likeBookQueries";
import { useDislikeBook } from "@/endpoints/mutations/likeBookMutation";
import { useToast } from "@/components/ui/UseToast";

import Loading from "../loading";

import { Button } from "@/components/ui/Button";
import { CardUserHover } from "@/components/CardUserHover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Separator } from "@/components/ui/Separator";
import { Subtitle } from "@/components/Subtitle";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { Title } from "@/components/Title";

interface DislikeBookProps {
    likeId: string;
    bookId: string;
    bookTitle: string;
}

interface UserLikesProps {
    username: string;
}

export function ClientUserLikes({ username }: UserLikesProps) {
    const { user } = useAuthContext();
    const { toast } = useToast();
    const isCurrentUser = isPageUserSameCurrentUser(username);

    const { data: targetUser, isFetched: isFetchedTargetUser } = useFetchUserByUsername({
        username: username,
    });

    const { data: bookLikes, isFetching: isFetchingBookLikes } = useGetBookLikesByUser({
        userId: targetUser?.id || "",
        enabled: !!targetUser?.id,
    });

    const dislikeBook = useDislikeBook();
    function handleDislikeBook({ likeId, bookId, bookTitle }: DislikeBookProps) {
        if (!user?.id) return;

        dislikeBook.mutate(
            {
                userId: user.id,
                bookId,
                likeId,
            },
            {
                onSuccess: () => {
                    toast({
                        title: `${bookTitle} foi removido das suas curtidas.`,
                    });
                },
            },
        );
    }

    if (!targetUser && isFetchedTargetUser) {
        notFound();
    }

    if (!isFetchedTargetUser || isFetchingBookLikes) {
        return <Loading />;
    }

    return (
        <>
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                <div>
                    <Title>{isCurrentUser ? "Minhas curtidas" : `Curtidas de ${username}`}</Title>
                    {isCurrentUser && (
                        <Subtitle>O cantinho pra você guardar todas as coisas que curtiu.</Subtitle>
                    )}
                </div>

                {targetUser && <CardUserHover user={targetUser} />}
            </div>

            <Separator className="my-6" />

            <div className="mt-4 flex w-full flex-col gap-8 md:flex-row lg:gap-6 xl:gap-8">
                {/* Sidebar */}
                {/* <div className="text-black dark:text-white md:w-1/4">Filtros</div> */}

                <Table className="relative">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-14">#</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Autor(a)</TableHead>
                            <TableHead>Ano</TableHead>
                            <TableHead>Páginas</TableHead>
                            <TableHead>Curtido em</TableHead>
                            {isCurrentUser && <TableHead className="text-right"></TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookLikes?.map((like, index) => (
                            <TableRow key={like.id}>
                                <TableCell className="w-14 font-medium">{index + 1}</TableCell>
                                <TableCell className="whitespace-nowrap">
                                    <Link
                                        href={`/livros/${like.bookId}`}
                                        className="flex items-center gap-3 font-medium hover:underline"
                                    >
                                        <div className="w-12">
                                            {like.book.imageUrl ? (
                                                <Image
                                                    src={like.book.imageUrl}
                                                    width={48}
                                                    height={70}
                                                    loading="eager"
                                                    quality={100}
                                                    alt={`Capa do livro ${like.book.title}`}
                                                    title={`Capa do livro ${like.book.title}`}
                                                    className="w-full overflow-hidden rounded-md"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center rounded-sm border">
                                                    <ImageIcon
                                                        size={20}
                                                        className="text-muted-foreground"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        {like.book.title}
                                    </Link>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {like.book.authors[0]}
                                </TableCell>
                                <TableCell>{publishDateFormat(like.book.publishDate)}</TableCell>
                                <TableCell>{like.book.pageCount}</TableCell>
                                <TableCell>
                                    {format(new Date(like.createdAt), "dd/MM/yyyy", {
                                        locale: pt,
                                    })}
                                </TableCell>
                                {isCurrentUser && (
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="default"
                                                    className="flex h-8 w-8 p-0 data-[state=open]:bg-zinc-300 dark:data-[state=open]:bg-accent"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Abrir menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px]">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleDislikeBook({
                                                            likeId: like.id,
                                                            bookId: like.bookId,
                                                            bookTitle: like.book.title,
                                                        })
                                                    }
                                                >
                                                    Descurtir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
