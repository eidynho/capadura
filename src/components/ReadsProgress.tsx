import { Dispatch, Fragment, SetStateAction, useContext, useState } from "react";
import { format, parseISO } from "date-fns";
import { Menu, Transition } from "@headlessui/react";
import {
    ArrowUUpLeft,
    DotsThreeVertical,
    Lock,
    LockSimpleOpen,
    PencilSimple,
    PlusCircle,
    ProhibitInset,
    Trash,
    User,
} from "phosphor-react";
import { toast } from "react-toastify";
import { pt } from "date-fns/locale";

import { api } from "@/lib/api";
import { AuthContext } from "@/contexts/AuthContext";

import { BookData, ReadData } from "@/pages/books/[id]";

import { NewReadProgressDialog } from "./dialogs/ReadProgress/NewReadProgressDialog";
import { UpdateReadProgressDialog } from "./dialogs/ReadProgress/UpdateReadProgressDialog";
import { CreateReadReviewDialog } from "./dialogs/ReadReview/CreateReadReviewDialog";
import { UpdateReadReviewDialog } from "./dialogs/ReadReview/UpdateReadReviewDialog";
import { RatingStars } from "./RatingStars";
import { Button } from "./Button";
import { Badge } from "./Badge";

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
    userReads: ReadData[] | null;
    setUserReads: Dispatch<SetStateAction<ReadData[] | null>>;
}

type ReadStatus = "ACTIVE" | "FINISHED" | "CANCELLED" | "DELETED";

export function ReadsProgress({ bookData, userReads, setUserReads }: ReadsProgressProps) {
    const { user } = useContext(AuthContext);

    const [isFetching, setIsFetching] = useState(false);
    const [isOpenUpdateProgressDialog, setIsOpenUpdateProgressDialog] = useState(false);
    const [progressEditData, setProgressEditData] = useState<EditReadData | null>(null);

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
            await api.put("/read", {
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
        let variant: "green" | "sky" | "yellow" | "red" | "gray" = "gray";

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
            {(!userReads?.length || userReads[0].status === "FINISHED") && (
                <div className="flex flex-col items-center gap-2 py-4">
                    <div className="flex w-full flex-col items-center justify-center gap-2 px-4 lg:flex-row">
                        <Button
                            size="md"
                            onClick={startNewRead}
                            className="group w-full gap-3 bg-transparent text-black enabled:hover:bg-pink-500 lg:w-64"
                        >
                            <PlusCircle
                                size={28}
                                className="text-pink-500 transition-colors group-hover:text-black"
                            />
                            <div className="flex flex-col items-start">
                                <span className="font-medium">Nova leitura</span>
                                <span className="-mt-[2px] text-start text-xs font-semibold text-gray-500 transition-colors group-hover:text-black">
                                    Vou começar uma nova leitura
                                </span>
                            </div>
                        </Button>

                        {!userReads && (
                            <CreateReadReviewDialog
                                bookData={bookData}
                                setUserReads={setUserReads}
                                isReviewWithoutProgress
                            />
                        )}
                    </div>
                </div>
            )}

            {userReads?.[0] &&
                userReads.map((read) => (
                    <div key={read.id} className="relative rounded-lg border border-black text-sm">
                        {/* read cancelled */}
                        {read.status === "CANCELLED" && (
                            <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg backdrop-blur-sm">
                                <span className="mx-8 text-center text-lg font-medium">
                                    Você abandonou a leitura, deseja retomar?
                                </span>
                                <Button
                                    onClick={() => toggleReadStatus(read.id, "ACTIVE")}
                                    size="md"
                                    className="enabled:hover:bg-pink-500"
                                >
                                    <ArrowUUpLeft size={20} weight="bold" />
                                    Retomar leitura
                                </Button>
                            </div>
                        )}

                        <div className="m-6 flex flex-col gap-2 rounded-lg">
                            {/* read active */}
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <User size={20} />
                                    <span>{user?.name}</span>

                                    {/* Rating stars */}
                                    <div className="inline-flex items-center gap-2">
                                        {read.reviewRating ? (
                                            <>
                                                <div className="mx-1 h-5 w-px bg-black"></div>
                                                <div className="inline-flex items-center">
                                                    <RatingStars rating={read.reviewRating} />
                                                </div>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {renderReadStatus(read.status as ReadStatus)}

                                    {/* Privacy badge */}
                                    <Badge variant="gray">
                                        {read.isPrivate ? (
                                            <Lock size={14} />
                                        ) : (
                                            <LockSimpleOpen size={14} />
                                        )}
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

                                    <Menu as="div" className="relative inline-block">
                                        <Menu.Button className="cursor-pointer rounded-lg p-1 text-sm hover:bg-gray-400/20">
                                            <DotsThreeVertical size={20} weight="bold" />
                                        </Menu.Button>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 mt-1 w-48 rounded-md border border-black bg-white py-2 shadow-[0.25rem_0.25rem_#000] ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <Menu.Item
                                                    as="div"
                                                    onClick={() =>
                                                        toggleReadPrivacy(read.id, read.isPrivate)
                                                    }
                                                    className="mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-lg border border-transparent py-2 pl-4 hover:bg-black hover:bg-opacity-10"
                                                >
                                                    {read.isPrivate ? (
                                                        <>
                                                            <LockSimpleOpen
                                                                size={16}
                                                                weight="bold"
                                                            />
                                                            <span>Tornar público</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Lock size={16} weight="bold" />
                                                            <span>Tornar privado</span>
                                                        </>
                                                    )}
                                                </Menu.Item>
                                                {read.status !== "FINISHED" && (
                                                    <Menu.Item
                                                        as="div"
                                                        onClick={() =>
                                                            toggleReadStatus(read.id, "CANCELLED")
                                                        }
                                                        className="mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-lg border border-transparent py-2 pl-4 hover:bg-black hover:bg-opacity-10"
                                                    >
                                                        <ProhibitInset size={18} weight="bold" />
                                                        <span>Abandonar leitura</span>
                                                    </Menu.Item>
                                                )}
                                                <Menu.Item
                                                    as="div"
                                                    className="mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-lg border border-transparent py-2 pl-4 text-red-900 hover:bg-red-500 hover:bg-opacity-10"
                                                >
                                                    <Trash size={18} weight="bold" />
                                                    <span>Excluir</span>
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>

                            <div className="my-1 flex flex-wrap items-center justify-between gap-2">
                                <div className="text-sm">
                                    <span className="mr-1 font-bold">Início da leitura:</span>
                                    <span>
                                        {format(
                                            parseISO(read.startDate.toString()),
                                            "dd 'de' MMMM 'de' yyyy",
                                            { locale: pt },
                                        )}
                                    </span>
                                </div>
                                {read.endDate && (
                                    <div className="text-sm">
                                        <span className="mr-1 font-bold">Fim da leitura:</span>
                                        <span>
                                            {format(
                                                parseISO(read?.endDate.toString()),
                                                "dd 'de' MMMM 'de' yyyy",
                                                { locale: pt },
                                            )}
                                        </span>
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
                                    <Button
                                        size="xs"
                                        className="bg-white text-black enabled:hover:bg-white enabled:hover:shadow-[0.125rem_0.125rem_#000]"
                                    >
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
                                                    <User size={20} />
                                                    <span>{user?.name}</span>
                                                    <span className="mt-[2px] text-xs font-semibold text-gray-500">
                                                        {format(
                                                            parseISO(progress.createdAt.toString()),
                                                            "dd/MM/yyyy",
                                                        )}
                                                    </span>
                                                </div>

                                                <Menu as="div" className="relative inline-block">
                                                    <Menu.Button className="cursor-pointer rounded-lg p-1 text-sm hover:bg-gray-400/20">
                                                        <DotsThreeVertical
                                                            size={20}
                                                            weight="bold"
                                                        />
                                                    </Menu.Button>
                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Menu.Items className="absolute right-0 z-10 mt-1 w-48 rounded-md border border-black bg-white py-2 shadow-[0.25rem_0.25rem_#000] ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                            <Menu.Item
                                                                as="div"
                                                                onClick={() =>
                                                                    editProgress({
                                                                        ...progress,
                                                                        countType: "page",
                                                                    })
                                                                }
                                                                className="mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-lg border border-transparent py-2 pl-4 hover:bg-black hover:bg-opacity-10"
                                                            >
                                                                <PencilSimple
                                                                    size={18}
                                                                    weight="bold"
                                                                />
                                                                <span>Editar</span>
                                                            </Menu.Item>
                                                            <Menu.Item
                                                                as="div"
                                                                className="mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-lg border border-transparent py-2 pl-4 text-red-900 hover:bg-red-500 hover:bg-opacity-10"
                                                            >
                                                                <Trash size={18} weight="bold" />
                                                                <span>Excluir</span>
                                                            </Menu.Item>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>
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
                ))}

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
