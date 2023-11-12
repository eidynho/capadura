import { notFound } from "next/navigation";

import { API_BASE_URL } from "@/constants/api";

import { BookData } from "@/endpoints/queries/booksQueries";

export const fetchBookData = async (bookId: string) => {
    const response = await fetch(`${API_BASE_URL}/book/${bookId}`);
    let data = await response.json();

    if (!data) {
        // revalidate data to verify if book exists now
        const refetchResponse = await fetch(`${API_BASE_URL}/book/${bookId}`, {
            next: {
                revalidate: 0,
            },
        });

        data = await refetchResponse.json();

        if (!data) {
            return notFound();
        }
    }

    return data as BookData;
};
