import { Dispatch, Fragment, SetStateAction, useContext, useState } from "react";
import { format, parseISO } from "date-fns";
import { Menu, Transition } from "@headlessui/react";
import {
    BookOpen,
    DotsThreeVertical,
    LockSimple,
    LockSimpleOpen,
    PencilSimple,
    PlusCircle,
    ProhibitInset,
    Trash,
    User,
} from "phosphor-react";
import { toast } from "react-toastify";

import { api } from "@/lib/api";
import { AuthContext } from "@/contexts/AuthContext";

import { BookData, ReadData } from "@/pages/app/books/[id]";

import { NewReadProgressDialog } from "./dialogs/NewReadProgressDialog";
import { UpdateReadProgressDialog } from "./dialogs/UpdateReadProgressDialog";
import { Button } from "./Button";

interface EditReadData {
    id: string;
    description: string;
    is_spoiler: boolean;
    page: number | null;
    countType: "page" | "percentage";
}

interface ReadsProgressProps {
    bookData: BookData | null;
    userReads: ReadData[] | null;
    setUserReads: Dispatch<SetStateAction<ReadData[] | null>>;
}

export function ReadsProgress({ bookData, userReads, setUserReads }: ReadsProgressProps) {
    const { user } = useContext(AuthContext);

    const [isOpenUpdateProgressDialog, setIsOpenUpdateProgressDialog] = useState(false);
    const [progressEditData, setProgressEditData] = useState<EditReadData | null>(null);

    async function startNewRead() {
        try {
            await api.post("/read", {
                bookId: bookData?.id,
            });
        } catch (err) {
            toast.error("Erro ao iniciar a leitura, tente novamente mais tarde.");

            throw err;
        }
    }

    function editReadProgress({ id, description, is_spoiler, page, countType }: EditReadData) {
        setProgressEditData({
            id,
            description,
            is_spoiler,
            page,
            countType,
        });

        setIsOpenUpdateProgressDialog(true);
    }

    return (
        <div className="rounded-lg border border-black p-6 text-sm">
            <div className="flex flex-1 flex-col gap-2">
                {userReads?.length ? (
                    userReads.map((read) => (
                        <Fragment key={read.id}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <User size={20} />
                                    <span>{user?.name}</span>
                                </div>

                                <Menu as="div" className="relative inline-block">
                                    <Menu.Button className="cursor-pointer rounded-lg p-1 text-sm hover:bg-gray-400/20">
                                        <DotsThreeVertical size={20} />
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
                                            <Menu.Item>
                                                <div className="mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-lg border border-transparent py-2 pl-4 hover:bg-black hover:bg-opacity-10">
                                                    {read.is_private ? (
                                                        <>
                                                            <LockSimpleOpen
                                                                size={16}
                                                                weight="bold"
                                                            />
                                                            Tornar público
                                                        </>
                                                    ) : (
                                                        <>
                                                            <LockSimple size={16} weight="bold" />
                                                            Tornar privado
                                                        </>
                                                    )}
                                                </div>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <div className="mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-lg border border-transparent py-2 pl-4 hover:bg-black hover:bg-opacity-10">
                                                    <ProhibitInset size={18} weight="bold" />
                                                    Abandonar leitura
                                                </div>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <div className="mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-lg border border-transparent py-2 pl-4 text-red-900 hover:bg-red-500 hover:bg-opacity-10">
                                                    <Trash size={18} weight="bold" />
                                                    Excluir
                                                </div>
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>

                            <div className="mt-3 flex items-center">
                                <div className="flex items-center gap-1 text-sm font-medium">
                                    <span>
                                        {read.progress[0]?.page ?? read.progress[0]?.percentage}
                                    </span>
                                </div>
                                <div className="relative mx-2 h-5 flex-1 overflow-hidden rounded border border-black bg-white dark:bg-gray-700">
                                    <div
                                        className="h-5 bg-pink-500"
                                        style={{
                                            width: `${read.progress[0]?.percentage}%` ?? 0,
                                        }}
                                    ></div>
                                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold">
                                        {`${read.progress[0]?.percentage}%`}
                                    </span>
                                </div>
                                <span className="w-8 text-sm font-medium">
                                    {bookData?.pageCount}
                                </span>
                            </div>

                            <div className="text-sm">
                                <span className="mr-1 font-semibold">Início da leitura:</span>
                                <span>
                                    {format(parseISO(read.start_date.toString()), "dd/MM/yyyy")}
                                </span>
                            </div>
                            {read.end_date && (
                                <div className="text-sm">
                                    <span className="mr-1 font-semibold">Fim da leitura:</span>
                                    <span>
                                        {format(parseISO(read?.end_date.toString()), "dd/MM/yyyy")}
                                    </span>
                                </div>
                            )}

                            <div className="mt-4">
                                {bookData && (
                                    <NewReadProgressDialog
                                        readId={read.id}
                                        bookTitle={bookData?.title}
                                        bookPageCount={bookData?.pageCount ?? 0}
                                        setUserReads={setUserReads}
                                    />
                                )}
                            </div>
                            <div className="mt-2 flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-semibold">Últimos progressos</h4>
                                    <Button
                                        size="xs"
                                        className="bg-white text-black enabled:hover:bg-white enabled:hover:shadow-[0.125rem_0.125rem_#000]"
                                    >
                                        Ver todos
                                    </Button>
                                </div>
                                <div className="max-h-[32rem] min-h-[8rem] resize-y overflow-y-auto">
                                    {read.progress.map((progress) => (
                                        <div
                                            key={progress.id}
                                            className="border-t border-black p-4"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <User size={20} />
                                                    <span>{user?.name}</span>
                                                    <span className="mt-[2px] text-xs font-semibold text-gray-500">
                                                        {format(
                                                            parseISO(
                                                                progress.created_at.toString(),
                                                            ),
                                                            "dd/MM/yyyy",
                                                        )}
                                                    </span>
                                                </div>

                                                <Menu as="div" className="relative inline-block">
                                                    <Menu.Button className="cursor-pointer rounded-lg p-1 text-sm hover:bg-gray-400/20">
                                                        <DotsThreeVertical size={20} />
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
                                                            <Menu.Item>
                                                                <div
                                                                    onClick={() =>
                                                                        editReadProgress({
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
                                                                    Editar
                                                                </div>
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                <div className="mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-lg border border-transparent py-2 pl-4 text-red-900 hover:bg-red-500 hover:bg-opacity-10">
                                                                    <Trash
                                                                        size={18}
                                                                        weight="bold"
                                                                    />
                                                                    Excluir
                                                                </div>
                                                            </Menu.Item>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>
                                            </div>

                                            {progress.description && (
                                                <p className="mt-2">{progress.description}</p>
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
                                    ))}

                                    <UpdateReadProgressDialog
                                        isOpen={isOpenUpdateProgressDialog}
                                        setIsOpen={setIsOpenUpdateProgressDialog}
                                        userReads={userReads}
                                        setUserReads={setUserReads}
                                        readId={read.id}
                                        bookTitle={bookData?.title}
                                        bookPageCount={bookData?.pageCount ?? 0}
                                        editData={progressEditData}
                                    />
                                </div>
                            </div>
                        </Fragment>
                    ))
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex w-full items-center justify-center gap-2">
                            <Button
                                size="md"
                                onClick={startNewRead}
                                className="gap-3 bg-transparent disabled:border-black disabled:opacity-50"
                            >
                                <PlusCircle size={34} />
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">Nova leitura</span>
                                    <span className="-mt-[2px] text-xs font-medium text-gray-500">
                                        Quero começar uma nova leitura
                                    </span>
                                </div>
                            </Button>
                            <Button size="md" className="gap-3 bg-transparent">
                                <BookOpen size={34} />
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">Avaliar</span>
                                    <span className="-mt-[2px] text-xs font-medium text-gray-500">
                                        Já finalizei a leitura e quero avaliar
                                    </span>
                                </div>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
