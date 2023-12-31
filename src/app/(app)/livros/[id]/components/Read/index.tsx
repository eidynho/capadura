"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ExternalLink, Lock, MoreVertical, Undo2, Unlock } from "lucide-react";
import { pt } from "date-fns/locale";

import { HandleAddNewProgressProps, HandleUpdateReadProps } from "./ReadReview/FormReadReview";

import { BookData } from "@/endpoints/queries/booksQueries";
import { ReadData, ReadStatus } from "@/endpoints/queries/readsQueries";
import { ProfileDataResponse } from "@/endpoints/queries/usersQueries";
import { ProgressData } from "@/endpoints/queries/progressQueries";
import {
    useDeleteRead,
    useToggleReadPrivacy,
    useToggleReadStatus,
    useUpdateRead,
} from "@/endpoints/mutations/readsMutations";
import {
    useCreateProgress,
    useDeleteProgress,
    useUpdateProgress,
} from "@/endpoints/mutations/progressMutations";
import { useToast } from "@/components/ui/UseToast";
import { useColorPalette } from "@/hooks/useColorPalette";
import { HandleUpdateProgressProps } from "./Progress/UpdateProgressDialog/FormUpdateProgress";

import { CardUserHover } from "@/components/CardUserHover";
import { CreateReadReviewDialog } from "./ReadReview/CreateReadReviewDialog";
import { UpdateReadReviewDialog } from "./ReadReview/UpdateReadReviewDialog";
import { DeleteReadDialog } from "./DeleteReadDialog";
import { CreateProgressDialog } from "./Progress/CreateProgressDialog";
import { DeleteProgressDialog } from "./Progress/DeleteProgressDialog";
import { UpdateProgressDialog } from "./Progress/UpdateProgressDialog";
import { Progress } from "./Progress";
import { RatingStars } from "@/components/RatingStars";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Separator } from "@/components/ui/Separator";

export interface EditReadData {
    readId: string;
    id: string;
    description: string;
    isSpoiler: boolean;
    page: number;
    percentage: number;
    countType: "page" | "percentage";
}

export interface DeleteProgressData {
    readId: string;
    progressId: string;
}

interface ReadProps {
    user: ProfileDataResponse;
    read: ReadData;
    progressList?: ProgressData[];
    bookData: BookData;
    canEdit: boolean;
    showExternalLink?: boolean;
    showProgress?: boolean;
}

export function Read({
    user,
    read,
    progressList,
    bookData,
    canEdit,
    showExternalLink,
    showProgress,
}: ReadProps) {
    const [isOpenUpdateProgressDialog, setIsOpenUpdateProgressDialog] = useState(false);
    const [isOpenDeleteProgressDialog, setIsOpenDeleteProgressDialog] = useState(false);
    const [isOpenDeleteReadDialog, setIsOpenDeleteReadDialog] = useState(false);

    const [progressEditData, setProgressEditData] = useState<EditReadData | null>(null);
    const [progressDeleteData, setProgressDeleteData] = useState<DeleteProgressData | null>(null);
    const [readToDelete, setReadToDelete] = useState<ReadData | null>(null);

    const { toast } = useToast();
    const router = useRouter();
    const palette = useColorPalette(bookData.imageUrl);

    const updateRead = useUpdateRead();
    async function handleUpdateRead({
        readId,
        status,
        reviewContent,
        reviewRating,
        reviewIsSpoiler,
        endRead,
    }: HandleUpdateReadProps) {
        if (updateRead.isLoading || !canEdit) {
            return;
        }

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
        if (!readToDelete?.id || deleteRead.isLoading || !canEdit) {
            return;
        }

        deleteRead.mutate(
            {
                bookId: bookData.id,
                readId: readToDelete.id,
                status: readToDelete.status,
            },
            {
                onSuccess: () => {
                    setIsOpenDeleteReadDialog(false);

                    // is read id page
                    if (document.location.pathname.includes("/leituras/")) {
                        router.push(`/livros/${bookData.id}`);
                    }
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
        if (toggleReadPrivacy.isLoading || !canEdit) {
            return;
        }
        toggleReadPrivacy.mutate({
            bookId: bookData.id,
            readId,
            isPrivate: currentStatus,
        });
    }

    const toggleReadStatus = useToggleReadStatus();
    function handleToggleReadStatus(readId: string, status: ReadStatus) {
        if (toggleReadStatus.isLoading || !canEdit) {
            return;
        }

        toggleReadStatus.mutate({
            bookId: bookData.id,
            readId,
            status,
        });
    }

    const addNewProgress = useCreateProgress();
    async function handleAddNewProgress({
        readId,
        description,
        isSpoiler,
        pagesCount,
        countType,
        bookPageCount,
    }: HandleAddNewProgressProps) {
        if (addNewProgress.isLoading || !canEdit) {
            return;
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
    }: HandleUpdateProgressProps) {
        if (updateProgress.isLoading || !canEdit) {
            return;
        }

        await updateProgress.mutateAsync({
            bookId: bookData.id,
            readId,
            progressId: id,
            description,
            isSpoiler,
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
        percentage,
        countType,
    }: EditReadData) {
        setProgressEditData({
            readId,
            id,
            description,
            isSpoiler,
            page,
            percentage,
            countType,
        });

        setIsOpenUpdateProgressDialog(true);
    }

    const deleteProgress = useDeleteProgress();
    function handleDeleteProgress() {
        if (!bookData || deleteProgress.isLoading || !canEdit) {
            return;
        }

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

    const lastProgressPercentage = progressList?.[0]
        ? progressList[0].percentage
        : read.progress?.[0]?.percentage;

    return (
        <Fragment key={read.id}>
            <div className="relative rounded-md border bg-white text-sm transition-colors dark:bg-dark">
                {/* read cancelled */}
                {read.status === "CANCELLED" && (
                    <div className="absolute z-20 flex h-full w-full flex-col items-center justify-center gap-2 rounded-md bg-muted-foreground/10 backdrop-blur-sm">
                        <span className="mx-8 text-center text-base font-medium text-black dark:text-white">
                            {canEdit
                                ? "Você abandonou a leitura, deseja retomar?"
                                : `${user.username} abandonou essa leitura.`}
                        </span>
                        {canEdit && (
                            <Button
                                variant="outline"
                                onClick={() => handleToggleReadStatus(read.id, "ACTIVE")}
                            >
                                <Undo2 size={18} />
                                Retomar leitura
                            </Button>
                        )}
                    </div>
                )}

                <div className="m-6 flex flex-col gap-2 rounded-md">
                    {/* read active */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            {user && <CardUserHover user={user} />}

                            {!!read.reviewRating && (
                                <Separator orientation="vertical" className="h-6"></Separator>
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

                            {showExternalLink && (
                                <Link href={`/livros/${read.bookId}/leituras/${read.id}`}>
                                    <Button size="icon-sm" variant="default">
                                        <ExternalLink size={16} />
                                    </Button>
                                </Link>
                            )}

                            {/* Edit rating */}
                            {typeof read.reviewRating === "number" && canEdit && (
                                <UpdateReadReviewDialog
                                    readId={read.id}
                                    bookData={bookData}
                                    editData={{
                                        reviewContent: read.reviewContent || undefined,
                                        reviewRating: read.reviewRating ?? 0,
                                        reviewIsSpoiler: read.reviewIsSpoiler ?? false,
                                    }}
                                    handleUpdateRead={handleUpdateRead}
                                    handleAddNewProgress={handleAddNewProgress}
                                />
                            )}

                            {canEdit && (
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
                            )}
                        </div>
                    </div>

                    <div className="my-1 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm font-medium text-muted-foreground">
                            Início da leitura:{" "}
                            {format(new Date(read.startDate), "dd 'de' MMMM 'de' yyyy", {
                                locale: pt,
                            })}
                        </div>
                        {read.endDate && (
                            <div className="text-sm font-medium text-muted-foreground">
                                Fim da leitura:{" "}
                                {format(new Date(read.endDate), "dd 'de' MMMM 'de' yyyy", {
                                    locale: pt,
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-start gap-2">
                        {read.reviewIsSpoiler && (
                            <Badge variant="red" className="min-w-[103px]">
                                Contém spoiler
                            </Badge>
                        )}

                        {read.reviewContent && (
                            <p className="max-h-96 overflow-auto text-justify text-black dark:text-white">
                                {read.reviewContent}
                            </p>
                        )}
                    </div>

                    {canEdit && (
                        <div className="mt-2 flex items-center gap-2">
                            {lastProgressPercentage !== 100 && (
                                <CreateProgressDialog
                                    readId={read.id}
                                    bookTitle={bookData.title}
                                    bookPageCount={bookData.pageCount ?? 0}
                                    palette={palette}
                                    handleAddNewProgress={handleAddNewProgress}
                                />
                            )}

                            {read.reviewRating === null && lastProgressPercentage === 100 && (
                                <CreateReadReviewDialog
                                    readId={read.id}
                                    bookData={bookData}
                                    palette={palette}
                                    handleUpdateRead={handleUpdateRead}
                                    handleAddNewProgress={handleAddNewProgress}
                                />
                            )}
                        </div>
                    )}

                    {showProgress && (
                        <Progress
                            canEdit={canEdit}
                            user={user}
                            bookId={bookData.id}
                            readId={read.id}
                            showMoreProgressBtn={showExternalLink ?? false}
                            progressList={progressList || read.progress}
                            bookPageCount={bookData.pageCount ?? 0}
                            setProgressEditData={handleSetProgressEditData}
                            setProgressDeleteData={handleSetProgressDeleteData}
                        />
                    )}
                </div>
            </div>

            {progressEditData && (
                <UpdateProgressDialog
                    isOpen={isOpenUpdateProgressDialog}
                    setIsOpen={handleOpenUpdateProgressDialog}
                    bookTitle={bookData.title}
                    bookPageCount={bookData.pageCount ?? 0}
                    editData={progressEditData}
                    handleUpdateProgress={handleUpdateProgress}
                />
            )}
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
        </Fragment>
    );
}
