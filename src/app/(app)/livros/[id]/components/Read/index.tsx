"use client";

import { useContext, useState } from "react";
import { format, parseISO } from "date-fns";
import { BookOpen, Lock, MoreVertical, PlusCircle, Undo2, Unlock } from "lucide-react";
import { toast } from "react-toastify";
import { pt } from "date-fns/locale";

import { AuthContext } from "@/contexts/AuthContext";
import { BookData } from "@/app/(app)/livros/[id]/page";
import { HandleAddNewProgressProps, HandleUpdateReadProps } from "./ReadReview/FormReadReview";

import { useFetchUserReadsByBook } from "@/endpoints/queries/readsQueries";
import {
    ReadStatus,
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

import { CreateReadReviewDialog } from "./ReadReview/CreateReadReviewDialog";
import { UpdateReadReviewDialog } from "./ReadReview/UpdateReadReviewDialog";
import { NewProgressDialog } from "./Progress/NewProgressDialog";
import { DeleteProgressDialog } from "./Progress/DeleteProgressDialog";
import { HandleUpdateProgressProps, UpdateProgressDialog } from "./Progress/UpdateProgressDialog";
import { RatingStars } from "@/components/RatingStars";
import { UserHoverCard } from "@/components/UserHoverCard";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Separator } from "@/components/ui/Separator";
import { Progress } from "./Progress";

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

interface ReadsProgressProps {
    bookData: BookData | null;
}

export function ReadsProgress({ bookData }: ReadsProgressProps) {
    const { user, isAuthenticated } = useContext(AuthContext);
    if (!isAuthenticated) return;

    const [isOpenUpdateProgressDialog, setIsOpenUpdateProgressDialog] = useState(false);
    const [isOpenDeleteProgressDialog, setIsOpenDeleteProgressDialog] = useState(false);

    const [progressEditData, setProgressEditData] = useState<EditReadData | null>(null);
    const [progressDeleteData, setProgressDeleteData] = useState<DeleteProgressData | null>(null);

    const [currentTab, setCurrentTab] = useState("all");

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

        if (userReads && userReads.items?.length > 50) {
            toast.error("Limite de leitura atingido.");
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
        if (!bookData?.id || updateRead.isLoading) return;

        await updateRead.mutateAsync({
            bookId: bookData.id,
            readId,
            status,
            reviewContent,
            reviewRating,
            reviewIsSpoiler,
            endRead,
        });
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
            toast.error("Erro ao deletar progresso de leitura.");
            return;
        }

        deleteProgress.mutate({
            bookId: bookData.id,
            readId: progressDeleteData.readId,
            progressId: progressDeleteData.progressId,
        });
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

    function renderReadStatus(status: ReadStatus) {
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

    const tabNoReadsFoundType =
        currentTab === "all"
            ? " encontrada"
            : currentTab === "active"
            ? " em andamento"
            : " finalizada";

    return (
        <>
            <div className="mt-2">
                <ul className="-mb-px flex flex-wrap items-center justify-between text-center text-sm font-medium">
                    <div className="flex flex-wrap items-center py-1">
                        <div className="flex items-center gap-2 pl-2 pr-4 text-black dark:text-white">
                            <BookOpen size={16} />
                            <h3 className="font-semibold">Leituras</h3>
                        </div>

                        <Tabs
                            value={currentTab}
                            onValueChange={setCurrentTab}
                            defaultValue="account"
                        >
                            <TabsList>
                                <TabsTrigger value="all">Todas</TabsTrigger>
                                <TabsTrigger value="active">Em andamento</TabsTrigger>
                                <TabsTrigger value="finished">Finalizadas</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {(!userReads?.items?.length || userReads.items[0].status === "FINISHED") && (
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex flex-col items-center justify-center gap-2 lg:flex-row">
                                <Button size="sm" variant="outline" onClick={handleStartNewRead}>
                                    <PlusCircle size={16} />
                                    Nova leitura
                                </Button>

                                {(!userReads || !userReads.items.length) && (
                                    <CreateReadReviewDialog
                                        bookData={bookData}
                                        handleStartNewRead={handleStartNewRead}
                                        handleUpdateRead={handleUpdateRead}
                                        handleAddNewProgress={handleAddNewProgress}
                                        isReviewWithoutProgress
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </ul>
            </div>

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
                                    {user && <UserHoverCard user={user} />}

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
                                    {renderReadStatus(read.status as ReadStatus)}

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

                                            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
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
                                            handleAddNewProgress={handleAddNewProgress}
                                        />
                                    )}

                                    {read.reviewRating === null &&
                                        read.progress?.[0]?.percentage === 100 && (
                                            <CreateReadReviewDialog
                                                readId={read.id}
                                                bookData={bookData}
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
                <div className="mt-2 flex h-36 w-full flex-col items-center justify-center rounded-md border bg-white text-center dark:bg-dark">
                    <h2 className="text-base font-semibold text-black dark:text-white">
                        Nenhuma leitura {tabNoReadsFoundType}.
                    </h2>
                    <p className="mt-2 w-[26rem] text-sm leading-6 text-muted-foreground">
                        Que tal iniciar a leitura desse livro?
                    </p>
                </div>
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
        </>
    );
}
