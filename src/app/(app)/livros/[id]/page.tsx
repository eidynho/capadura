import { Suspense } from "react";
import { fetchBookData } from "@/utils/fetch-book-data";

import Loading from "./loading";

import { BookDescription } from "./components/BookDescription";
import { UserReads } from "./components/Read/UserReads";
import { BookReviews } from "./components/Read/BookReviews";

interface BookProps {
    params: {
        id: string;
    };
}

export default async function Book({ params }: BookProps) {
    const bookData = await fetchBookData(params.id);

    return (
        <Suspense fallback={<Loading />}>
            <BookDescription description={bookData.description} />
            <UserReads bookData={bookData} />
            <BookReviews bookData={bookData} />
        </Suspense>
    );
}
