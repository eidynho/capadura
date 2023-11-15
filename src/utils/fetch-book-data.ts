import { notFound } from "next/navigation";

import { API_BASE_URL } from "@/constants/api";

import { BookData } from "@/endpoints/queries/booksQueries";

export const fetchBookData = async (bookId: string) => {
    try {
        if (!bookId) {
            throw new Error("bookId not provided.");
        }

        const response = await fetch(`${API_BASE_URL}/book/${bookId}`);
        const data = await response.json();

        console.log(`${API_BASE_URL}/book/${bookId}`, data);

        if (!data?.id) {
            throw new Error("Book not found.");
        }

        return data as BookData;
    } catch (err) {
        console.error(err);
        notFound();
    }
};
