"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { BookMarked, Lock, MoreVertical, Undo2, Unlock } from "lucide-react";
import { pt } from "date-fns/locale";

import { useAuthContext } from "@/contexts/AuthContext";
import { HandleAddNewProgressProps, HandleUpdateReadProps } from "./ReadReview/FormReadReview";

import { BookData } from "@/endpoints/queries/booksQueries";
import { ReadData, useFetchUserReadsByBook } from "@/endpoints/queries/readsQueries";
import {
    ReadStatus,
    useDeleteRead,
    useStartNewRead,
    useToggleReadPrivacy,
    useToggleReadStatus,
    useUpdateRead,
} from "@/endpoints/mutations/readsMutations";
import {
    useAddNewProgress,
    useDeleteProgress,
    useUpdateProgress,
} from "@/endpoints/mutations/progressMutations";
import { useToast } from "@/components/ui/UseToast";
import { useColorPalette } from "@/hooks/useColorPalette";

import { CardUserHover } from "@/components/CardUserHover";
import { CreateReadReviewDialog } from "./ReadReview/CreateReadReviewDialog";
import { UpdateReadReviewDialog } from "./ReadReview/UpdateReadReviewDialog";
import { DeleteReadDialog } from "./DeleteReadDialog";
import { NewProgressDialog } from "./Progress/NewProgressDialog";
import { DeleteProgressDialog } from "./Progress/DeleteProgressDialog";
import { HandleUpdateProgressProps, UpdateProgressDialog } from "./Progress/UpdateProgressDialog";
import { Progress } from "./Progress";
import { RatingStars } from "@/components/RatingStars";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
    CardAction,
    CardActionDescription,
    CardActionPicture,
    CardActionTitle,
} from "@/components/ui/CardAction";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Separator } from "@/components/ui/Separator";
import { SpiralWavy } from "@/components/svg/SpiralWavy";

export interface EditReadData {
    readId: string;
    id: string;
    description: string;
    isSpoiler: boolean;
    page: number | null;
    countType: "page" | "percentage";
}

export interface DeleteProgressData {
    readId: string;
    progressId: string;
}

interface UserReadsProps {
    bookData: BookData | null;
}

export function UserReads({ bookData }: UserReadsProps) {
    const { user, isAuthenticated } = useAuthContext();
    const { toast } = useToast();

    const [isOpenUpdateProgressDialog, setIsOpenUpdateProgressDialog] = useState(false);
    const [isOpenDeleteProgressDialog, setIsOpenDeleteProgressDialog] = useState(false);
    const [isOpenDeleteReadDialog, setIsOpenDeleteReadDialog] = useState(false);

    const [progressEditData, setProgressEditData] = useState<EditReadData | null>(null);
    const [progressDeleteData, setProgressDeleteData] = useState<DeleteProgressData | null>(null);
    const [readToDelete, setReadToDelete] = useState<ReadData | null>(null);

    const [currentTab, setCurrentTab] = useState("all");

    const palette = useColorPalette(bookData?.imageUrl);

    const { data: userReads } = useFetchUserReadsByBook({
        bookId: bookData?.id || "",
        enabled: isAuthenticated && !!bookData?.id,
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
        if (!bookData?.id || startNewRead.isLoading) return;

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
        if (!user?.id || !bookData?.id || updateRead.isLoading) return;

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

    const deleteRead = useDeleteRead();
    function handleDeleteRead() {
        if (!bookData?.id || !readToDelete?.id || deleteRead.isLoading) return;

        deleteRead.mutate(
            {
                bookId: bookData.id,
                readId: readToDelete.id,
                status: readToDelete.status,
            },
            {
                onSuccess: () => {
                    setIsOpenDeleteReadDialog(false);
                },
            },
        );
    }

    function startDeleteRead(read: ReadData) {
        setReadToDelete(read);
        setIsOpenDeleteReadDialog(true);
    }

    function handleOpenDeleteReadDialog(value: boolean) {
        setIsOpenDeleteReadDialog(value);
    }

    const toggleReadPrivacy = useToggleReadPrivacy();
    function handleToggleReadPrivacy(readId: string, currentStatus: boolean) {
        if (!bookData?.id || toggleReadPrivacy.isLoading) return;
        toggleReadPrivacy.mutate({
            bookId: bookData.id,
            readId,
            isPrivate: currentStatus,
        });
    }

    const toggleReadStatus = useToggleReadStatus();
    function handleToggleReadStatus(readId: string, status: ReadStatus) {
        if (toggleReadStatus.isLoading) return;

        if (!bookData?.id) {
            throw new Error("Failed on update read status: book data not provided.");
        }

        toggleReadStatus.mutate({
            bookId: bookData.id,
            readId,
            status,
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

        if (!bookData?.id) {
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

    const updateProgress = useUpdateProgress();
    async function handleUpdateProgress({
        id,
        readId,
        description,
        isSpoiler,
        pagesCount,
        countType,
        bookPageCount,
    }: HandleUpdateProgressProps) {
        if (updateProgress.isLoading) return;

        if (!bookData?.id) {
            throw new Error("Failed on update read status: book data not provided.");
        }

        await updateProgress.mutateAsync({
            bookId: bookData?.id,
            readId,
            progressId: id,
            description,
            isSpoiler,
            pagesCount,
            countType,
            bookPageCount,
        });
    }

    function handleOpenUpdateProgressDialog(value: boolean) {
        setIsOpenUpdateProgressDialog(value);
    }

    function handleSetProgressEditData({
        readId,
        id,
        description,
        isSpoiler,
        page,
        countType,
    }: EditReadData) {
        setProgressEditData({
            readId,
            id,
            description,
            isSpoiler,
            page,
            countType,
        });

        setIsOpenUpdateProgressDialog(true);
    }

    const deleteProgress = useDeleteProgress();
    function handleDeleteProgress() {
        if (!bookData || deleteProgress.isLoading) return;

        if (!progressDeleteData?.readId || !progressDeleteData?.progressId) {
            toast({
                title: "Erro ao deletar progresso de leitura.",
                description: "Atualize a página e tente novamente.",
                variant: "destructive",
            });
            return;
        }

        deleteProgress.mutate(
            {
                bookId: bookData.id,
                readId: progressDeleteData.readId,
                progressId: progressDeleteData.progressId,
            },
            {
                onSuccess: () => {
                    setIsOpenDeleteProgressDialog(false);
                },
            },
        );
    }

    function handleSetProgressDeleteData({ readId, progressId }: DeleteProgressData) {
        setProgressDeleteData({
            readId,
            progressId,
        });

        setIsOpenDeleteProgressDialog(true);
    }

    function handleOpenDeleteProgressDialog(value: boolean) {
        setIsOpenDeleteProgressDialog(value);
    }

    function ReadStatusBadge({ status }: { status: ReadStatus }) {
        let message = "";
        let variant: "green" | "sky" | "yellow" | "red" | "default" = "default";

        switch (status) {
            case "ACTIVE":
                message = "Em andamento";
                variant = "sky";
                break;
            case "FINISHED":
                message = "Leitura finalizada";
                variant = "green";
                break;
            case "CANCELLED":
                message = "Leitura abandonada";
                variant = "yellow";
                break;
        }

        return <Badge variant={variant}>{message}</Badge>;
    }

    if (!isAuthenticated || !filteredReads) return;

    const hasPreviousReads = userReads?.items?.length;
    const lastReadIsFinished = userReads?.items[0]?.status === "FINISHED";

    return (
        <>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-y-2">
                <div className="flex items-center gap-2 pl-2 pr-4 text-black dark:text-white">
                    <BookMarked size={16} />
                    <h2 className="font-semibold">Minhas leituras</h2>
                </div>

                <Tabs value={currentTab} onValueChange={setCurrentTab} defaultValue="account">
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
                    <div
                        key={read.id}
                        className="relative rounded-md border bg-white text-sm transition-colors dark:bg-dark"
                    >
                        {/* read cancelled */}
                        {read.status === "CANCELLED" && (
                            <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center gap-2 rounded-md bg-muted-foreground/10 backdrop-blur-sm">
                                <span className="mx-8 text-center text-base font-medium text-black dark:text-white">
                                    Você abandonou a leitura, deseja retomar?
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => handleToggleReadStatus(read.id, "ACTIVE")}
                                >
                                    <Undo2 size={18} />
                                    Retomar leitura
                                </Button>
                            </div>
                        )}

                        <div className="m-6 flex flex-col gap-2 rounded-md">
                            {/* read active */}
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    {user && <CardUserHover user={user} />}

                                    {!!read.reviewRating && (
                                        <Separator
                                            orientation="vertical"
                                            className="h-6"
                                        ></Separator>
                                    )}

                                    {/* Rating stars */}
                                    <div className="ml-1 inline-flex items-center gap-2">
                                        {!!read.reviewRating && (
                                            <div className="inline-flex items-center">
                                                <RatingStars rating={read.reviewRating} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {<ReadStatusBadge status={read.status} />}

                                    {/* Privacy badge */}
                                    <Badge variant="default">
                                        {read.isPrivate ? <Lock size={12} /> : <Unlock size={12} />}
                                        {read.isPrivate ? "Privado" : "Público"}
                                    </Badge>

                                    {/* Edit rating */}
                                    {typeof read.reviewRating === "number" && (
                                        <UpdateReadReviewDialog
                                            readId={read.id}
                                            bookData={bookData}
                                            editData={{
                                                reviewContent: read.reviewContent || undefined,
                                                reviewRating: read.reviewRating ?? 0,
                                                reviewIsSpoiler: read.reviewIsSpoiler ?? false,
                                            }}
                                            handleStartNewRead={handleStartNewRead}
                                            handleUpdateRead={handleUpdateRead}
                                            handleAddNewProgress={handleAddNewProgress}
                                        />
                                    )}

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon-sm" variant="default">
                                                <MoreVertical
                                                    size={16}
                                                    className="text-black dark:text-white"
                                                />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-44">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleToggleReadPrivacy(read.id, read.isPrivate)
                                                }
                                            >
                                                <span>
                                                    Tornar {read.isPrivate ? "público" : "privado"}
                                                </span>
                                            </DropdownMenuItem>

                                            {read.status !== "FINISHED" && (
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleToggleReadStatus(read.id, "CANCELLED")
                                                    }
                                                >
                                                    <span>Abandonar leitura</span>
                                                </DropdownMenuItem>
                                            )}

                                            <DropdownMenuItem
                                                onClick={() => startDeleteRead(read)}
                                                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                            >
                                                <span>Excluir</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <div className="my-1 flex flex-wrap items-center justify-between gap-2">
                                <div className="text-sm font-medium text-muted-foreground">
                                    Início da leitura:{" "}
                                    {format(
                                        parseISO(read.startDate.toString()),
                                        "dd 'de' MMMM 'de' yyyy",
                                        { locale: pt },
                                    )}
                                </div>
                                {read.endDate && (
                                    <div className="text-sm font-medium text-muted-foreground">
                                        Fim da leitura:{" "}
                                        {format(
                                            parseISO(read.endDate.toString()),
                                            "dd 'de' MMMM 'de' yyyy",
                                            { locale: pt },
                                        )}
                                    </div>
                                )}
                            </div>

                            {read.reviewContent && (
                                <p className="text-justify text-black dark:text-white">
                                    {read.reviewContent}
                                </p>
                            )}

                            {bookData && (
                                <div className="mt-2 flex items-center gap-2">
                                    {read.progress?.[0]?.percentage !== 100 && (
                                        <NewProgressDialog
                                            readId={read.id}
                                            bookTitle={bookData?.title}
                                            bookPageCount={bookData?.pageCount ?? 0}
                                            palette={palette}
                                            handleAddNewProgress={handleAddNewProgress}
                                        />
                                    )}

                                    {read.reviewRating === null &&
                                        read.progress?.[0]?.percentage === 100 && (
                                            <CreateReadReviewDialog
                                                readId={read.id}
                                                bookData={bookData}
                                                palette={palette}
                                                handleStartNewRead={handleStartNewRead}
                                                handleUpdateRead={handleUpdateRead}
                                                handleAddNewProgress={handleAddNewProgress}
                                            />
                                        )}
                                </div>
                            )}

                            <Progress
                                progressList={read.progress}
                                bookPageCount={bookData?.pageCount ?? 0}
                                setProgressEditData={handleSetProgressEditData}
                                setProgressDeleteData={handleSetProgressDeleteData}
                            />
                        </div>
                    </div>
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

            <UpdateProgressDialog
                isOpen={isOpenUpdateProgressDialog}
                setIsOpen={handleOpenUpdateProgressDialog}
                bookTitle={bookData?.title}
                bookPageCount={bookData?.pageCount ?? 0}
                editData={progressEditData}
                handleUpdateProgress={handleUpdateProgress}
            />

            <DeleteProgressDialog
                isOpen={isOpenDeleteProgressDialog}
                setIsOpen={handleOpenDeleteProgressDialog}
                deleteProgress={handleDeleteProgress}
                isDeleteProgressLoading={deleteProgress.isLoading}
            />

            <DeleteReadDialog
                isOpen={isOpenDeleteReadDialog}
                setIsOpen={handleOpenDeleteReadDialog}
                deleteRead={handleDeleteRead}
                isDeleteReadLoading={deleteRead.isLoading}
            />
        </>
    );
}
