"use client";

import { toast } from "react-toastify";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useGetUserLikedBook } from "@/endpoints/queries/likeBookQueries";
import { useAddLikeBook, useDislikeBook } from "@/endpoints/mutations/likeBookMutation";

interface LikeProps {
    bookId: string;
}

export function Like({ bookId }: LikeProps) {
    // const [like, setLike] = useState<LikeBook | null>(null);

    const { data: like } = useGetUserLikedBook({
        bookId,
    });

    const addLikeBook = useAddLikeBook();
    const dislikeBook = useDislikeBook();

    async function handleToggleLikeBook() {
        const isLiked = !!like;

        try {
            if (isLiked) {
                await dislikeBook.mutateAsync({
                    bookId,
                    likeId: like.id,
                });
            } else {
                await addLikeBook.mutateAsync({
                    bookId,
                });
            }
        } catch (err) {
            const message = isLiked ? "descurtir" : "curtir";

            toast.error(`Não foi possível ${message} o livro.`);
            throw err;
        }
    }

    return (
        <Button
            size="sm"
            variant="neobrutalism"
            onClick={handleToggleLikeBook}
            className={`${like ? "bg-pink-500 text-black" : ""} hover:bg-pink-500`}
        >
            <Heart size={16} />
            <span className="font-medium">{like ? "Curtido" : "Curtir"}</span>
        </Button>
    );
}
