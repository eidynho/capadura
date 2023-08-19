"use client";

import { useContext, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { BookOpen, Lock, MoreVertical, PlusCircle, Undo2, Unlock } from "lucide-react";
import { toast } from "react-toastify";
import { pt } from "date-fns/locale";

import { api } from "@/lib/api";
import { AuthContext } from "@/contexts/AuthContext";

import { BookData, ReadData } from "@/app/(app)/livros/[id]/page";

import { CreateReadReviewDialog } from "./ReadReview/CreateReadReviewDialog";
import { UpdateReadReviewDialog } from "./ReadReview/UpdateReadReviewDialog";
import { NewReadProgressDialog } from "./ReadProgress/NewReadProgressDialog";
import { UpdateReadProgressDialog } from "./ReadProgress/UpdateReadProgressDialog";
import { RatingStars } from "@/components/RatingStars";
import { UserHoverCard } from "@/components/UserHoverCard";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

const readsTabs = [
    {
        name: "Todas",
        status: null,
        emptyMessage: "Nenhuma leitura encontrada.",
    },
    {
        name: "Em andamento",
        status: "ACTIVE",
        emptyMessage: "Nenhuma leitura em andamento.",
    },
    {
        name: "Finalizadas",
        status: "FINISHED",
        emptyMessage: "Nenhuma leitura finalizada.",
    },
];

interface EditReadData {
    readId: string;
    id: string;
    description: string;
    isSpoiler: boolean;
    page: number | null;
    countType: "page" | "percentage";
}

interface ReadsProgressProps {
    bookData: BookData | null;
}

type ReadStatus = "ACTIVE" | "FINISHED" | "CANCELLED" | "DELETED";

export function ReadsProgress({ bookData }: ReadsProgressProps) {
    const { user } = useContext(AuthContext);

    const [userReads, setUserReads] = useState<ReadData[] | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isOpenUpdateProgressDialog, setIsOpenUpdateProgressDialog] = useState(false);
    const [progressEditData, setProgressEditData] = useState<EditReadData | null>(null);
    const [currentTab, setCurrentTab] = useState("all");

    useEffect(() => {
        async function fetchUserReads() {
            if (!bookData?.id) return;

            try {
                const userReadsResponse = await api.get(`/user-reads?bookId=${bookData.id}`);
                setUserReads(userReadsResponse.data.items);
            } catch (err) {
                toast.error("Failed on fetch user reads");
            }
        }
        fetchUserReads();
    }, [bookData]);

    const filteredReads = userReads?.filter((item) => {
        switch (currentTab) {
            case "all":
                return true;
            case "active":
                return item.status === "ACTIVE";
            case "finished":
                return item.status === "FINISHED";
        }
    });

    async function startNewRead() {
        if (userReads && userReads.length > 50) {
            toast.error("Limite de leitura atingido.");
            return;
        }

        if (isFetching) return;
        setIsFetching(true);

        try {
            const { data } = await api.post("/read", {
                bookId: bookData?.id,
            });

            setUserReads((prev) => {
                if (!prev) {
                    return [{ ...data, progress: [] }];
                }

                const updatedReads = [...prev];

                updatedReads.unshift(data);
                return updatedReads;
            });
        } catch (err) {
            toast.error("Erro ao iniciar a leitura.");
            throw err;
        } finally {
            setIsFetching(false);
        }
    }

    async function toggleReadPrivacy(readId: string, currentStatus: boolean) {
        if (isFetching) return;
        setIsFetching(true);

        try {
            await api.put("/read", {
                readId,
                isPrivate: !currentStatus,
            });

            setUserReads((prev) => {
                if (!prev) return null;

                const updatedReads = [...prev];

                const read = updatedReads.find((read) => read.id === readId);
                if (read) {
                    read.isPrivate = !currentStatus;
                }

                return updatedReads;
            });

            toast.success("A privacidade da leitura foi alterada.");
        } catch (err) {
            toast.error("Erro ao alterar privacidade da leitura.");
            throw err;
        } finally {
            setIsFetching(false);
        }
    }

    async function toggleReadStatus(readId: string, status: ReadStatus) {
        if (isFetching) return;
        setIsFetching(true);

        try {
            if (!bookData) {
                throw new Error("Failed on update read status: book data not provided.");
            }

            await api.put("/read", {
                bookId: bookData.id,
                readId,
                status,
            });

            setUserReads((prev) => {
                if (!prev) return null;

                const updatedReads = [...prev];

                const read = updatedReads.find((read) => read.id === readId);
                if (read) {
                    read.status = status;
                }

                return updatedReads;
            });

            toast.success("O status da leitura foi atualizado.");
        } catch (err) {
            toast.error("Erro ao alterar o status da leitura.");
            throw err;
        } finally {
            setIsFetching(false);
        }
    }

    function editProgress({ readId, id, description, isSpoiler, page, countType }: EditReadData) {
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

    return (
        <>
            <div className="mt-2">
                <ul className="-mb-px flex flex-wrap items-center justify-between text-center text-sm font-medium">
                    <div className="flex flex-wrap items-center py-1">
                        <div className="flex items-center gap-2 pl-2 pr-4 text-black">
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

                    {(!userReads?.length || userReads[0].status === "FINISHED") && (
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex flex-col items-center justify-center gap-2 lg:flex-row">
                                <Button size="sm" variant="outline" onClick={startNewRead}>
                                    <PlusCircle size={16} className="text-pink-500" />
                                    Nova leitura
                                </Button>

                                {(!userReads || !userReads.length) && (
                                    <CreateReadReviewDialog
                                        bookData={bookData}
                                        setUserReads={setUserReads}
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
                    <div key={read.id} className="relative rounded-md border border-black text-sm">
                        {/* read cancelled */}
                        {read.status === "CANCELLED" && (
                            <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center gap-2 rounded-md bg-white/20 backdrop-blur-sm">
                                <span className="mx-8 text-center text-base font-medium">
                                    Você abandonou a leitura, deseja retomar?
                                </span>
                                <Button
                                    size="sm"
                                    variant="black"
                                    onClick={() => toggleReadStatus(read.id, "ACTIVE")}
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

                                    {/* Rating stars */}
                                    <div className="inline-flex items-center gap-2">
                                        {read.reviewRating && (
                                            <>
                                                <div className="mx-1 h-5 w-px bg-black"></div>
                                                <div className="inline-flex items-center">
                                                    <RatingStars rating={read.reviewRating} />
                                                </div>
                                            </>
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
                                            setUserReads={setUserReads}
                                            editData={{
                                                reviewContent: read.reviewContent || undefined,
                                                reviewRating: read.reviewRating ?? 0,
                                                reviewIsSpoiler: read.reviewIsSpoiler ?? false,
                                            }}
                                        />
                                    )}

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon-sm" variant="default">
                                                <MoreVertical size={16} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-44">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    toggleReadPrivacy(read.id, read.isPrivate)
                                                }
                                            >
                                                <span>
                                                    Tornar {read.isPrivate ? "público" : "privado"}
                                                </span>
                                            </DropdownMenuItem>

                                            {read.status !== "FINISHED" && (
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        toggleReadStatus(read.id, "CANCELLED")
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
                                <p className="text-justify">{read.reviewContent}</p>
                            )}

                            {bookData && (
                                <div className="mt-2 flex items-center gap-2">
                                    {read.progress?.[0]?.percentage !== 100 && (
                                        <NewReadProgressDialog
                                            readId={read.id}
                                            bookId={bookData?.id}
                                            bookTitle={bookData?.title}
                                            bookPageCount={bookData?.pageCount ?? 0}
                                            setUserReads={setUserReads}
                                        />
                                    )}

                                    {read.reviewRating === null &&
                                        read.progress?.[0]?.percentage === 100 && (
                                            <CreateReadReviewDialog
                                                readId={read.id}
                                                bookData={bookData}
                                                setUserReads={setUserReads}
                                            />
                                        )}
                                </div>
                            )}
                            <div className="mt-2 flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-bold">Progressos anteriores</h4>
                                    <Button size="sm" variant="outline">
                                        Ver todos
                                    </Button>
                                </div>
                                {read.progress?.length ? (
                                    read.progress.map((progress) => (
                                        <div
                                            key={progress.id}
                                            className="border-t border-black/20 p-4"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    {user && <UserHoverCard user={user} />}

                                                    <span className="mt-[2px] text-xs font-semibold text-gray-500">
                                                        {format(
                                                            parseISO(progress.createdAt.toString()),
                                                            "dd/MM/yyyy",
                                                        )}
                                                    </span>
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon-sm" variant="default">
                                                            <MoreVertical size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                editProgress({
                                                                    ...progress,
                                                                    countType: "page",
                                                                })
                                                            }
                                                        >
                                                            <span>Editar</span>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                                            <span>Excluir</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            {progress.description && (
                                                <p className="mt-2 text-justify">
                                                    {progress.description}
                                                </p>
                                            )}

                                            <div className="mt-4 flex items-center">
                                                <div className="flex items-center gap-1 text-sm font-medium">
                                                    <span>{progress.page}</span>
                                                </div>
                                                <div className="relative mx-2 h-5 flex-1 overflow-hidden rounded  border-black bg-white dark:bg-gray-700">
                                                    <div
                                                        className="h-5 bg-pink-500"
                                                        style={{
                                                            width: `${progress.percentage}%` ?? 0,
                                                        }}
                                                    ></div>
                                                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold">
                                                        {`${progress.percentage}%`}
                                                    </span>
                                                </div>
                                                <span className="w-8 text-sm font-medium">
                                                    {bookData?.pageCount}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <span>Nenhum progresso encontrado.</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <span className="mt-1 text-center text-sm">
                    Nenhuma leitura
                    {currentTab === "all"
                        ? " encontrada"
                        : currentTab === "active"
                        ? " em andamento"
                        : " finalizada"}
                    .
                </span>
            )}
            <UpdateReadProgressDialog
                isOpen={isOpenUpdateProgressDialog}
                setIsOpen={setIsOpenUpdateProgressDialog}
                setUserReads={setUserReads}
                bookTitle={bookData?.title}
                bookPageCount={bookData?.pageCount ?? 0}
                editData={progressEditData}
            />
        </>
    );
}
