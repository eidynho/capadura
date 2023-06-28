import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { api } from "@/lib/api";
import { ProgressFormSchema, progressFormSchema } from "./NewReadProgressDialog";

import { BaseDialog } from "../headless-ui/BaseDialog";
import { Button } from "../Button";
import { ReadData } from "@/pages/app/books/[id]";

interface ReadProgressDialogProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;

    userReads: ReadData[];
    setUserReads: Dispatch<SetStateAction<ReadData[] | null>>;

    readId: string;
    bookTitle?: string;
    bookPageCount: number;
    editData: {
        id: string;
        description: string;
        is_spoiler: boolean;
        page: number | null;
        countType: "page" | "percentage";
    } | null;
}

export function UpdateReadProgressDialog({
    isOpen,
    setIsOpen,

    userReads,
    setUserReads,

    readId,
    bookTitle,
    bookPageCount,
    editData,
}: ReadProgressDialogProps) {
    useEffect(() => {
        if (editData) {
            setValue("description", editData.description);
            setValue("isSpoiler", editData.is_spoiler);
            setValue("pagesCount", editData.page || 0);
            setValue("countType", editData.countType);
        }
    }, [isOpen]);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset,
        setValue,
    } = useForm<ProgressFormSchema>({
        resolver: zodResolver(progressFormSchema),
        defaultValues: {
            isSpoiler: false,
            countType: "page",
        },
    });

    async function updateProgress({
        description,
        isSpoiler,
        pagesCount,
        countType,
    }: ProgressFormSchema) {
        try {
            await api.put("/progress", {
                id: editData?.id,
                description,
                isSpoiler,
                pagesCount,
                countType,
                bookPageCount,
            });

            toast.success("Progresso atualizado com sucesso.");

            // update front-end
            userReads.forEach((read) => {
                if (read.id === readId) {
                    const progressIndex = read.progress.findIndex(
                        (progress) => progress.id === editData?.id,
                    );
                    if (progressIndex < 0) return;

                    const progress = read.progress[progressIndex];

                    let page = 0;
                    let percentage = 0;
                    if (countType === "page") {
                        page = Math.round(pagesCount);
                        percentage = Math.round((pagesCount / bookPageCount) * 100);
                    }

                    if (countType === "percentage") {
                        page = Math.round((bookPageCount / 100) * pagesCount);
                        percentage = Math.round(pagesCount);
                    }

                    progress.description = description ?? "";
                    progress.is_spoiler = isSpoiler;
                    progress.page = page;
                    progress.percentage = percentage;
                }
            });

            setIsOpen(false);
            reset();
        } catch (err) {
            toast.error("Erro ao atualizar o progresso, tente novamente mais tarde.");

            throw err;
        }
    }

    return (
        <>
            <BaseDialog
                size="max-w-3xl"
                title={`Editar: Progresso de leitura - ${bookTitle}`}
                isOpen={isOpen}
                toggleDialog={() => setIsOpen(false)}
            >
                {/* Dialog body */}
                <div className="px-4 py-6">
                    <div className="mb-4">
                        <div className="flex items-start gap-8 rounded-lg px-3 py-2">
                            <form
                                onSubmit={handleSubmit(updateProgress)}
                                className="flex w-full flex-col gap-4"
                            >
                                <div>
                                    <label
                                        htmlFor="description-progress"
                                        className="flex items-center gap-1 text-sm font-semibold text-black"
                                    >
                                        Comentário
                                    </label>
                                    <textarea
                                        {...register("description")}
                                        name="description"
                                        id="description-progress"
                                        rows={4}
                                        placeholder="O que está achando?"
                                        className="mt-1 block w-full rounded-lg border border-black bg-white bg-opacity-60 px-3 py-2 text-sm outline-none focus:border-yellow-500 focus:ring-yellow-500"
                                    ></textarea>

                                    <div className="mt-1 flex items-center gap-x-3">
                                        <div className="flex h-6 items-center">
                                            <input
                                                {...register("isSpoiler")}
                                                name="isSpoiler"
                                                id="is-spoiler-checkbox"
                                                type="checkbox"
                                                className="h-4 w-4 rounded-lg accent-yellow-500 outline-yellow-500 focus:ring-yellow-400"
                                            />
                                        </div>
                                        <div className="text-sm leading-6">
                                            <label
                                                htmlFor="is-spoiler-checkbox"
                                                className="font-medium text-black"
                                            >
                                                Contém spoiler
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="page-read-count"
                                        className="flex text-sm font-semibold text-black"
                                    >
                                        Páginas/porcentagem lidas
                                    </label>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex flex-col">
                                            <input
                                                {...register("pagesCount")}
                                                id="page-read-count"
                                                name="pagesCount"
                                                type="number"
                                                placeholder="0"
                                                className={`${
                                                    errors.pagesCount
                                                        ? "border-red-500"
                                                        : "border-black"
                                                } mt-1 w-40 rounded-lg border px-3 py-2 text-sm outline-none focus:border-yellow-500 focus:ring-yellow-500`}
                                            />
                                            {errors.pagesCount && (
                                                <span className="text-xs text-red-500">
                                                    Campo obrigatório
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-6">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    {...register("countType")}
                                                    id="page-count-type"
                                                    type="radio"
                                                    value="page"
                                                    className="h-5 w-5 border-none accent-[#c38a00]"
                                                />
                                                <label
                                                    htmlFor="page-count-type"
                                                    className="text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Páginas
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    {...register("countType")}
                                                    id="percentage-count-type"
                                                    type="radio"
                                                    value="percentage"
                                                    className="h-5 w-5 border-none accent-[#c38a00]"
                                                />
                                                <label
                                                    htmlFor="percentage-count-type"
                                                    className="text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Porcentagem
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    size="md"
                                    type="submit"
                                    className="w-full bg-black text-white hover:bg-yellow-500"
                                >
                                    Editar progresso
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </BaseDialog>
        </>
    );
}
