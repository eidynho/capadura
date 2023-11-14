import { notFound } from "next/navigation";

import { API_BASE_URL } from "@/constants/api";

import { BookData } from "@/endpoints/queries/booksQueries";

export const fetchBookData = async (bookId: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/book/${bookId}`);
        let data = await response.json();

        if (!data) {
            // revalidate data to verify if book exists now
            const refetchResponse = await fetch(`${API_BASE_URL}/book/${bookId}`, {
                next: {
                    revalidate: 1000 * 60 * 60 * 24, // 24 hours
                },
            });

            data = await refetchResponse.json();

            if (!data) {
                throw new Error("Failed on fetch book data.");
            }
        }

        return data as BookData;
    } catch (err) {
        console.error(err);
        notFound();
    }
};
