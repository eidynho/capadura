import { fetchBookData } from "@/utils/fetch-book-data";

import { ClientRead } from "./components/ClientRead";

interface BookReadProps {
    params: {
        id: string;
        readId: string;
    };
}

export default async function BookRead({ params }: BookReadProps) {
    const bookData = await fetchBookData(params.id, false);

    return (
        <>
            {/* to fetch read on client side */}
            <ClientRead readId={params.readId} bookData={bookData} />
        </>
    );
}
