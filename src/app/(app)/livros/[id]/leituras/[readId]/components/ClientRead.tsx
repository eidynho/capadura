"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";

import { BookData } from "@/endpoints/queries/booksQueries";

import { useAuthContext } from "@/contexts/AuthContext";
import { useFetchRead } from "@/endpoints/queries/readsQueries";
import { ProgressData, useFetchReadProgress } from "@/endpoints/queries/progressQueries";
import { useFetchUserById } from "@/endpoints/queries/usersQueries";

import { Button } from "@/components/ui/Button";
import { Read } from "../../../components/Read";

interface ClientReadProps {
    readId: string;
    bookData: BookData;
}

export function ClientRead({ readId, bookData }: ClientReadProps) {
    const { user } = useAuthContext();

    const [fullProgressList, setFullProgressList] = useState<ProgressData[]>([]);
    const [page, setPage] = useState(1);

    const { data: readData, isFetched: isReadFetched } = useFetchRead({
        readId,
        enabled: true,
    });

    const { data: readCreator, isFetched: isReadCreatorFetched } = useFetchUserById({
        userId: readData?.userId || "",
        enabled: !!readData?.userId,
    });

    const {
        data: progressList,
        isFetched,
        isStale,
        refetch: refetchProgressList,
    } = useFetchReadProgress({
        readId,
        page,
    });

    useEffect(() => {
        if (isFetched && progressList) {
            setFullProgressList((prev) => [...prev, progressList.items].flat());
        }
    }, [isFetched]);

    useEffect(() => {
        if (progressList) {
            setFullProgressList(progressList.items);
        }
    }, [progressList]);

    useEffect(() => {
        refetchProgressList();
    }, [isStale]);

    if (!readData || !readCreator || !progressList) return;

    if ((!readData && isReadFetched) || (!readCreator && isReadCreatorFetched)) {
        notFound();
    }

    const isReaderCreator = user?.id === readCreator.id;
    const hasMoreProgress = progressList.total > fullProgressList.length;

    function fetchMoreProgress() {
        if (hasMoreProgress) {
            setPage((prev) => prev + 1);
        }
    }

    return (
        <>
            <Read
                user={readCreator}
                read={readData}
                bookData={bookData}
                progressList={fullProgressList}
                canEdit={isReaderCreator}
                showExternalLink={false}
                showProgress
            />

            {hasMoreProgress && (
                <Button
                    size="sm"
                    variant="primary"
                    onClick={fetchMoreProgress}
                    disabled={!hasMoreProgress}
                    className="mt-2"
                >
                    Carregar mais progressos
                </Button>
            )}
        </>
    );
}
