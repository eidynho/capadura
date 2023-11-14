import { notFound } from "next/navigation";

import { API_BASE_URL } from "@/constants/api";

import { BookData } from "@/endpoints/queries/booksQueries";

export const fetchBookData = async (bookId: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/book/${bookId}`);
        const data = await response.json();

        if (!data.id) {
            throw new Error("Book not found: " + data);
        }

        return data as BookData;
    } catch (err) {
        console.error(err);
        notFound();
    }
};
