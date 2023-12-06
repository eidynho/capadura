import { notFound } from "next/navigation";
import axios from "axios";

import { API_BASE_URL } from "@/constants/api";

import { BookData } from "@/endpoints/queries/booksQueries";
import { throwIfUndefined } from "./throw-if-undefined";

const handleUploadBookImage = async (bookId: string) => {
    const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";

    const { data } = await axios.get(
        `${GOOGLE_BOOKS_API_URL}/${bookId}?fields=volumeInfo(imageLinks)`,
    );

    const imageLinks = data?.volumeInfo?.imageLinks;
    const imageLink = imageLinks?.medium || imageLinks?.large || imageLinks?.extraLarge;

    if (imageLink) {
        await axios.put(`${API_BASE_URL}/book/${bookId}`, {
            imageLink: imageLink.replace("&edge=curl", ""),
        });
    }
};

export const fetchBookData = async (bookId: string) => {
    try {
        throwIfUndefined(bookId, "bookId not provided.");

        const { data } = await axios.get(`${API_BASE_URL}/book/${bookId}`);

        if (!data) {
            const { data: createdBook } = await axios.post(`${API_BASE_URL}/book`, {
                bookId,
            });

            if (!createdBook) {
                throw new Error("Book not found.");
            }

            return createdBook as BookData;
        }

        if (!data.imageKey) {
            await handleUploadBookImage(bookId);
        }

        return data as BookData;
    } catch (err) {
        // retry get data one more time
        try {
            const { data: refetchedBook } = await axios.get(`${API_BASE_URL}/book/${bookId}`);
            return refetchedBook as BookData;
        } catch (err) {
            console.error(err);
            notFound();
        }
    }
};
