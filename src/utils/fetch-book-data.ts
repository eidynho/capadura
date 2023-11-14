import { notFound } from "next/navigation";

import { API_BASE_URL } from "@/constants/api";

import { BookData } from "@/endpoints/queries/booksQueries";

export const fetchBookData = async (bookId: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/book/${bookId}`, {
            next: {
                revalidate: 1000 * 60 * 60 * 24, // 24 hours
            },
        });

        const data = await response.json();

        return data as BookData;
    } catch (err) {
        console.error(err);
        notFound();
    }
};
