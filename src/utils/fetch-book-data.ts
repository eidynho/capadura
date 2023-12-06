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

export const fetchBookData = async (bookId: string, canCreate: boolean) => {
    try {
        throwIfUndefined(bookId, "bookId not provided.");

        const { data } = await axios.get(`${API_BASE_URL}/book/${bookId}`);

        if (!data?.id && canCreate) {
            const { data } = await axios.post(`${API_BASE_URL}/book`, {
                bookId,
            });

            return data as BookData;
        }

        if (!data.imageKey) {
            handleUploadBookImage(bookId);
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
