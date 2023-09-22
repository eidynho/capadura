import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { API_BASE_URL } from "@/constants/api";
import { api } from "@/lib/api";

interface ParamsData {
    params: {
        id: string;
    };
}

export async function GET(req: NextRequest, { params }: ParamsData) {
    try {
        const cookiesStore = cookies();
        const token = cookiesStore.get("token");

        const fetchResponse = await fetch(`${API_BASE_URL}/book/${params.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const fetchData = await fetchResponse.json();

        if (fetchData === null) {
            const { data } = await api.post(`${API_BASE_URL}/book`, {
                bookId: params.id,
            });

            return NextResponse.json({ data });
        }

        return NextResponse.json({ data: fetchData });
    } catch (err) {
        throw err;
    }
}
