"use client";

import { useState } from "react";
import { BookMarked } from "lucide-react";

import { useAuthContext } from "@/contexts/AuthContext";
import { HandleAddNewProgressProps, HandleUpdateReadProps } from "./ReadReview/FormReadReview";

import { BookData } from "@/endpoints/queries/booksQueries";
import { useFetchUserReadsByBook } from "@/endpoints/queries/readsQueries";
import { useStartNewRead, useUpdateRead } from "@/endpoints/mutations/readsMutations";
import { useAddNewProgress } from "@/endpoints/mutations/progressMutations";
import { useToast } from "@/components/ui/UseToast";
import { useColorPalette } from "@/hooks/useColorPalette";

import { CreateReadReviewDialog } from "./ReadReview/CreateReadReviewDialog";
import {
    CardAction,
    CardActionDescription,
    CardActionPicture,
    CardActionTitle,
} from "@/components/ui/CardAction";
import { Read } from ".";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { SpiralWavy } from "@/components/svg/SpiralWavy";

interface UserReadsProps {
    bookData: BookData;
}

export function UserReads({ bookData }: UserReadsProps) {
    const { user, isAuthenticated } = useAuthContext();
    const { toast } = useToast();

    const [currentTab, setCurrentTab] = useState("all");

    const palette = useColorPalette(bookData.imageUrl);

    const { data: userReads } = useFetchUserReadsByBook({
        bookId: bookData.id || "",
        enabled: isAuthenticated && !!bookData.id,
    });

    const filteredReads = userReads?.items?.filter((item) => {
        switch (currentTab) {
            case "all":
                return true;
            case "active":
                return item.status === "ACTIVE";
            case "finished":
                return item.status === "FINISHED";
        }
    });

    const startNewRead = useStartNewRead();
    async function handleStartNewRead() {
        if (!bookData.id || startNewRead.isLoading) return;

        if (userReads && userReads.items?.length >= 10) {
            toast({
                title: "Limite de leitura atingido.",
                description: "Você pode registrar até 10 leituras por livro",
                variant: "destructive",
            });
            return;
        }

        const { id: createdReadId } = await startNewRead.mutateAsync({
            bookId: bookData.id,
        });

        return createdReadId;
    }

    const updateRead = useUpdateRead();
    async function handleUpdateRead({
        readId,
        status,
        reviewContent,
        reviewRating,
        reviewIsSpoiler,
        endRead,
    }: HandleUpdateReadProps) {
        if (!user?.id || !bookData.id || updateRead.isLoading) return;

        await updateRead.mutateAsync({
            userId: user.id,
            bookId: bookData.id,
            readId,
            status,
            reviewContent,
            reviewRating,
            reviewIsSpoiler,
            endRead,
        });
    }

    const addNewProgress = useAddNewProgress();
    async function handleAddNewProgress({
        readId,
        description,
        isSpoiler,
        pagesCount,
        countType,
        bookPageCount,
    }: HandleAddNewProgressProps) {
        if (addNewProgress.isLoading) return;

        if (!bookData.id) {
            throw new Error("Failed on add new progress: book data not provided.");
        }

        await addNewProgress.mutateAsync({
            bookId: bookData.id,
            readId,
            description,
            isSpoiler,
            pagesCount,
            countType,
            bookPageCount,
        });
    }

    if (!user || !isAuthenticated || !filteredReads) return;

    const hasPreviousReads = userReads?.items?.length;
    const lastReadIsFinished = userReads?.items[0]?.status === "FINISHED";

    return (
        <>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-y-2">
                <div className="flex items-center gap-2 pl-2 pr-4 text-black dark:text-white">
                    <BookMarked size={16} />
                    <h2 className="font-semibold">Minhas leituras</h2>
                </div>

                <Tabs value={currentTab} onValueChange={setCurrentTab} defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">Todas</TabsTrigger>
                        <TabsTrigger value="active">Em andamento</TabsTrigger>
                        <TabsTrigger value="finished">Finalizadas</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {(!hasPreviousReads || lastReadIsFinished) && (
                <>
                    <CardAction onClick={handleStartNewRead}>
                        <CardActionTitle>Iniciar nova leitura</CardActionTitle>
                        <CardActionDescription>
                            {lastReadIsFinished
                                ? "Já li esse livro e quero ler novamente."
                                : "Quero começar a registrar minha leitura."}
                        </CardActionDescription>
                        <CardActionPicture className="-right-20 rotate-90 group-hover:rotate-45">
                            <SpiralWavy palette={palette} />
                        </CardActionPicture>
                    </CardAction>

                    {!userReads?.items.length && (
                        <CreateReadReviewDialog
                            bookData={bookData}
                            palette={palette}
                            handleStartNewRead={handleStartNewRead}
                            handleUpdateRead={handleUpdateRead}
                            handleAddNewProgress={handleAddNewProgress}
                            isReviewWithoutProgress
                        />
                    )}
                </>
            )}

            {!!filteredReads?.length ? (
                filteredReads.map((read) => (
                    <Read
                        user={user}
                        read={read}
                        bookData={bookData}
                        canEdit={true}
                        showExternalLink={true}
                    />
                ))
            ) : (
                <>
                    {(currentTab === "active" || currentTab === "finished") && (
                        <div className="mt-2 flex h-36 w-full flex-col items-center justify-center rounded-md border bg-white text-center dark:bg-dark">
                            <span className="text-base font-semibold text-black dark:text-white">
                                {currentTab === "active"
                                    ? "Você não tem uma leitura em andamento."
                                    : "Você não tem uma leitura finalizada."}
                            </span>
                            <p className="mt-2 w-[26rem] text-sm leading-6 text-muted-foreground">
                                {currentTab === "active"
                                    ? "Inicie sua leitura e comece a marcar seus progressos."
                                    : "Finalize a leitura do livro para ver seu histórico."}
                            </p>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
