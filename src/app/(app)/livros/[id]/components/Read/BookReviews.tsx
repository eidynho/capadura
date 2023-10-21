"use client";

import { BookData } from "@/endpoints/queries/booksQueries";
import { useFetchReadsByBook } from "@/endpoints/queries/readsQueries";

import { SimpleRead } from "./SimpleRead";

interface BookReviewsProps {
    bookData: BookData;
}

export function BookReviews({ bookData }: BookReviewsProps) {
    const { data: bookReviews } = useFetchReadsByBook({
        bookId: bookData.id || "",
        enabled: !!bookData.id,
    });

    if (!bookReviews?.items?.length) return;

    return (
        <>
            <div className="mt-20 text-black dark:text-white">
                <h2 className="font-semibold">Avaliações de membros</h2>
            </div>

            {!!bookReviews?.items.length &&
                bookReviews.items.map((read) => {
                    if (!read.user) return;
                    return <SimpleRead read={read} />;
                })}
        </>
    );
}
