import { fetchBookData } from "@/utils/fetch-book-data";

import { BookDescription } from "./components/BookDescription";
import { UserReads } from "./components/Read/UserReads";
import { BookReviews } from "./components/Read/BookReviews";
import { BookGradient } from "./components/BookGradient";

interface BookProps {
    params: {
        id: string;
    };
}

export default async function Book({ params }: BookProps) {
    const bookData = await fetchBookData(params.id, false);
    if (!bookData) return;

    return (
        <>
            <BookGradient bookImageUrl={bookData.imageUrl} />
            <BookDescription description={bookData.description} />
            <UserReads bookData={bookData} />
            <BookReviews bookData={bookData} />
        </>
    );
}
