import { notFound } from "next/navigation";
import axios from "axios";

import { API_BASE_URL } from "@/constants/api";

import { BookData } from "@/endpoints/queries/booksQueries";

export const fetchBookData = async (bookId: string) => {
    try {
        if (!bookId) {
            throw new Error("bookId not provided.");
        }

        const { data } = await axios.get(`${API_BASE_URL}/book/${bookId}`);

        if (!data?.id) {
            const { data } = await axios.post(`${API_BASE_URL}/book`, {
                bookId,
            });

            return data as BookData;
        }

        if (!data.imageKey) {
            const googleBook = await axios.get(
                `https://www.googleapis.com/books/v1/volumes/${bookId}`,
            );

            const imageLink = googleBook.data?.volumeInfo?.imageLinks?.medium;

            if (imageLink) {
                await axios.putForm(`${API_BASE_URL}/book/${bookId}`, {
                    imageLink: imageLink.replace("&edge=curl", ""),
                });
            }
        }

        return data as BookData;
    } catch (err) {
        // retry get data one more time
        try {
            const { data } = await axios.get(`${API_BASE_URL}/book/${bookId}`);
            return data as BookData;
        } catch (err) {
            console.error(err);
            notFound();
        }
    }
};
