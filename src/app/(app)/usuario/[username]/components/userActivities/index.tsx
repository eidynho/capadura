"use client";

import Link from "next/link";
import { formatDistance } from "date-fns";
import { pt } from "date-fns/locale";
import { BookMarked, CircleDashed, CircleSlash, Heart, Star, Undo2 } from "lucide-react";

import {
    FetchUserActivitiesResponse,
    useFetchUserActivities,
} from "@/endpoints/queries/userActivitiesQueries";

import { RatingStars } from "@/components/RatingStars";

interface UserActivitiesProps {
    userId: string;
}

export function UserActivities({ userId }: UserActivitiesProps) {
    const { data: userActivities } = useFetchUserActivities({
        userId,
        enabled: !!userId,
    });

    function BookActivity({
        activity,
        activityType,
        createdAt,
        book,
        bookId,
    }: FetchUserActivitiesResponse) {
        if (!book || !bookId) return;

        const BookLink = (
            <Link
                href={`/livros/${bookId}`}
                className="font-medium text-black hover:underline dark:text-white"
            >
                {book.title}
            </Link>
        );

        const dateDistance = formatDistance(new Date(createdAt), new Date(), {
            locale: pt,
            addSuffix: true,
        }).replace("aproximadamente", "");

        switch (activityType) {
            case "LIKE_BOOK":
                if (!book || !bookId) return;
                return (
                    <>
                        <Heart size={15} className="text-pink-500" />
                        <div className="flex-1 text-muted-foreground">
                            <span className="mr-1">Curtiu o livro</span>
                            {BookLink}
                            <span className="mx-1">•</span>
                            {dateDistance}
                        </div>
                    </>
                );
            case "START_READ":
                if (!book || !bookId) return;
                return (
                    <>
                        <BookMarked size={15} className="text-violet-500" />
                        <div className="flex-1 text-muted-foreground">
                            <span className="mr-1">Iniciou a leitura de</span>
                            {BookLink}
                            <span className="mx-1">•</span>
                            {dateDistance}
                        </div>
                    </>
                );
            case "PAUSE_READ":
                if (!book || !bookId) return;
                return (
                    <>
                        <CircleSlash size={15} className="text-destructive" />
                        <div className="flex-1 text-muted-foreground">
                            <span className="mr-1">Pausou a leitura de</span>
                            {BookLink}
                            <span className="mx-1">•</span>
                            {dateDistance}
                        </div>
                    </>
                );
            case "RESUME_READ":
                if (!book || !bookId) return;
                return (
                    <>
                        <Undo2 size={15} className="text-blue-500" />
                        <div className="flex-1 text-muted-foreground">
                            <span className="mr-1">Retomou a leitura de</span>
                            {BookLink}
                            <span className="mx-1">•</span>
                            {dateDistance}
                        </div>
                    </>
                );
            case "ADD_BOOK_PROGRESS":
                if (!book || !bookId) return;
                return (
                    <>
                        <CircleDashed size={15} className="text-green-500" />
                        <div className="flex-1 text-muted-foreground">
                            <span className="mr-1">Fez um progresso em</span>
                            {BookLink}
                            <span className="mx-1">•</span>
                            {dateDistance}
                        </div>
                    </>
                );
            case "ADD_BOOK_REVIEW":
                if (!book || !bookId) return;
                return (
                    <>
                        <Star size={15} className="text-yellow-500" />
                        <div className="flex-1 text-muted-foreground">
                            <span className="mr-1">Avaliou</span>
                            {BookLink}
                            <span className="mx-1">em</span>
                            <RatingStars
                                rating={Number(activity)}
                                size={11}
                                className="text-muted-foreground"
                            />
                            <span className="mx-1">•</span>
                            {dateDistance}
                        </div>
                    </>
                );
        }
    }

    return (
        <div className="mt-2 flex flex-col gap-5 rounded-md border bg-white p-3 text-xs transition-colors dark:bg-dark">
            {!!userActivities?.length ? (
                userActivities.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                        {BookActivity(item)}
                    </div>
                ))
            ) : (
                <div className="text-center text-black dark:text-white">
                    Nenhuma atividade recente.
                </div>
            )}
        </div>
    );
}
