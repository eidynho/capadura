"use client";

import { Loader2, ThumbsUp } from "lucide-react";

import { useAuthContext } from "@/contexts/AuthContext";

import { useGetUserLikedBook } from "@/endpoints/queries/likeBookQueries";
import { useAddLikeBook, useDislikeBook } from "@/endpoints/mutations/likeBookMutation";

import { Button } from "@/components/ui/Button";

interface LikeProps {
    bookId: string;
}

export function Like({ bookId }: LikeProps) {
    const { user, isAuthenticated, toggleAuthDialog } = useAuthContext();

    const { data: like } = useGetUserLikedBook({
        bookId,
        enabled: isAuthenticated,
    });

    const addLikeBook = useAddLikeBook();
    const dislikeBook = useDislikeBook();

    async function handleToggleLikeBook() {
        if (!user?.id) return;

        if (!isAuthenticated) {
            toggleAuthDialog(true);
            return;
        }

        const isLiked = !!like;

        if (isLiked) {
            dislikeBook.mutate({
                userId: user.id,
                bookId,
                likeId: like.id,
            });
        } else {
            addLikeBook.mutate({
                userId: user.id,
                bookId,
            });
        }
    }

    const isLoading = addLikeBook.isLoading || dislikeBook.isLoading;

    return (
        <>
            <Button
                size="sm"
                variant={like ? "primary" : "outline"}
                onClick={handleToggleLikeBook}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 size={22} className="animate-spin" />
                ) : (
                    <ThumbsUp size={16} />
                )}
                <span className="font-medium">{like ? "Curtido" : "Curtir"}</span>
            </Button>
        </>
    );
}
