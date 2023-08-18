import axios from "axios";

import { GoogleAPIData } from "@/components/ApplicationSearch";

export async function fetchGoogleBooks(q: string) {
    const query = [];

    query.push("q=" + `"${q}"`);
    query.push("langRestrict=" + "pt-BR");
    query.push("maxResults=" + 8);
    query.push("startIndex=" + 0);
    query.push("orderBy=" + "relevance");
    query.push("printType=" + "books");

    return await axios.get<GoogleAPIData>(
        `https://www.googleapis.com/books/v1/volumes?${query.join("&")}`,
    );
}
