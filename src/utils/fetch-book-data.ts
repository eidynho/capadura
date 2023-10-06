import { notFound } from "next/navigation";

import { API_BASE_URL } from "@/constants/api";

import { BookData } from "@/endpoints/queries/booksQueries";

export const fetchBookData = async (bookId: string) => {
    const response = await fetch(`${API_BASE_URL}/book/${bookId}`);
    const data = await response.json();

    if (!data) {
        // revalidate data to verify if book exists now
        const refetchResponse = await fetch(`${API_BASE_URL}/book/${bookId}`, {
            next: {
                revalidate: 0,
            },
        });
        const refetchData = await refetchResponse.json();

        if (!refetchData) {
            return notFound();
        }

        return refetchData as BookData;
    }

    return data as BookData;
};
