import { API_BASE_URL } from "@/constants/api";

import { fetchBookData } from "@/utils/fetch-book-data";

import { BookDescription } from "./components/BookDescription";
import { UserReads } from "./components/Read/UserReads";
import { BookReviews } from "./components/Read/BookReviews";

interface BookProps {
    params: {
        id: string;
    };
}

interface BookIdData {
    id: string;
}

export async function generateStaticParams() {
    let bookIdList: BookIdData[] = [];
    for (let i = 1; i <= 100; i++) {
        const response = await fetch(`${API_BASE_URL}/book-ids?page=${i}&perPage=10000`);
        const data = await response.json();

        if (!data.length) {
            break;
        }

        bookIdList.push(data);
    }
    bookIdList = bookIdList.flat();

    return bookIdList.map((book) => ({
        id: book.id,
    }));
}

export default async function Book({ params }: BookProps) {
    const bookData = await fetchBookData(params.id);

    return (
        <>
            <BookDescription description={bookData.description} />
            <UserReads bookData={bookData} />
            <BookReviews bookData={bookData} />
        </>
    );
}
