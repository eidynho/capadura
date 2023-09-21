import type { NextApiRequest, NextApiResponse } from "next";
import { api } from "@/lib/api";

interface RequestData extends NextApiRequest {
    query: {
        bookId: string;
    };
}

interface ResponseData {
    message: string;
}

export default async function handler(req: RequestData, res: NextApiResponse<ResponseData>) {
    const { data } = await api.get(`/book/${req.query.bookId}`);

    res.status(200).json({ message: data });
}
