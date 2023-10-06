"use client";

import { notFound } from "next/navigation";

import { BookData } from "@/endpoints/queries/booksQueries";

import { useAuthContext } from "@/contexts/AuthContext";
import { useFetchRead } from "@/endpoints/queries/readsQueries";
import { useFetchUserById } from "@/endpoints/queries/usersQueries";

import { Button } from "@/components/ui/Button";
import { Read } from "../../../components/Read";

interface ClientReadProps {
    readId: string;
    bookData: BookData;
}

export function ClientRead({ readId, bookData }: ClientReadProps) {
    const { user } = useAuthContext();

    const { data: readData, isFetched: isReadFetched } = useFetchRead({
        readId,
        enabled: true,
    });

    const { data: readCreator, isFetched: isReadCreatorFetched } = useFetchUserById({
        userId: readData?.userId || "",
        enabled: !!readData?.userId,
    });

    if (!readData || !readCreator) return;

    if ((!readData && isReadFetched) || (!readCreator && isReadCreatorFetched)) {
        notFound();
    }

    const isReaderCreator = user?.id === readCreator.id;

    return (
        <>
            <Read
                user={readCreator}
                read={readData}
                bookData={bookData}
                canEdit={isReaderCreator}
                showExternalLink={false}
            />

            <Button size="sm" variant="primary" className="mt-2">
                Carregar mais progressos
            </Button>
        </>
    );
}
