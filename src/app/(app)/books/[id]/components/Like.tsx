"use client";

import { Button } from "@/components/Button";
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Heart } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface LikeBook {
    id: string;
    bookId: string;
    userId: string;
}

interface LikeProps {
    bookId: string;
}

export function Like({ bookId }: LikeProps) {
    const { user } = useContext(AuthContext);

    const [like, setLike] = useState<LikeBook | null>(null);

    useEffect(() => {
        async function getUserLike() {
            try {
                const userLikeResponse = await api.get(`/likes/book/${bookId}/user/${user?.id}`);
                setLike(userLikeResponse.data.like);
            } catch (err) {
                throw err;
            }
        }
        getUserLike();
    }, [bookId]);

    async function handleToggleLikeBook() {
        const isLiked = !!like;

        try {
            if (isLiked) {
                await api.delete(`/likes/${like.id}`);
                setLike(null);
            } else {
                if (!bookId) {
                    throw new Error("Book data not provided.");
                }

                if (!user?.id) {
                    throw new Error("User is not logged in.");
                }

                const { data } = await api.post("/likes", {
                    bookId,
                    userId: user.id,
                });

                setLike(data.like);
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
            onClick={handleToggleLikeBook}
            className={`${like ? "bg-pink-500 text-black enabled:hover:bg-pink-500" : ""}`}
        >
            <Heart size={20} />
            <span className="font-medium">{like ? "Curtido" : "Curtir"}</span>
        </Button>
    );
}
