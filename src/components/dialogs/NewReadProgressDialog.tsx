import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { PlusCircle } from "phosphor-react";

import { api } from "@/lib/api";
import { ProgressData, ReadData } from "@/pages/app/books/[id]";
import { BaseDialog } from "../radix-ui/BaseDialog";
import { Button } from "../Button";

export const progressFormSchema = z.object({
    description: z.string().optional(),
    isSpoiler: z.boolean().default(false),
    pagesCount: z.coerce.number().nonnegative().min(1, "Campo obrigatório"),
    countType: z.enum(["page", "percentage"]),
});

export type ProgressFormSchema = z.infer<typeof progressFormSchema>;

interface NewReadProgressDialogProps {
    readId: string;
    bookTitle?: string;
    bookPageCount: number;
    setUserReads: Dispatch<SetStateAction<ReadData[] | null>>;
}

export function NewReadProgressDialog({
    readId,
    bookTitle,
    bookPageCount,

    setUserReads,
}: NewReadProgressDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    function handleToggleDialog(state = false) {
        setIsOpen(state);
    }

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset,
    } = useForm<ProgressFormSchema>({
        resolver: zodResolver(progressFormSchema),
        defaultValues: {
            isSpoiler: false,
            countType: "page",
        },
    });

    async function submitNewProgress({
        description,
        isSpoiler,
        pagesCount,
        countType,
    }: ProgressFormSchema) {
        try {
            const { data } = await api.post<ProgressData>("/progress", {
                readId,
                description,
                isSpoiler,
                pagesCount,
                countType,
                bookPageCount,
            });

            setUserReads((prev) => {
                if (!prev) return null;

                const updatedReads = [...prev];

                updatedReads.forEach((read) => {
                    if (read.id === readId) {
                        read.progress.pop();
                        read.progress.unshift(data);
                    }
                });

                return updatedReads;
            });

            toast.success("Progresso adicionado com sucesso.");
            setIsOpen(false);

            reset();
        } catch (err) {
            toast.error("Erro ao adicionar um novo progresso, tente novamente mais tarde.");

            throw err;
        }
    }

    return (
        <>
            <Button size="sm" onClick={() => handleToggleDialog(true)}>
                <PlusCircle size={20} />
                <span className="font-medium">Novo progresso</span>
            </Button>

            <BaseDialog
                size="max-w-3xl"
                title={`Novo: Progresso de leitura - ${bookTitle}`}
                isOpen={isOpen}
                closeDialog={() => handleToggleDialog(false)}
            >
                {/* Dialog body */}
                <div className="px-4 py-6">
                    <div className="mb-4">
                        <div className="flex items-start gap-8 rounded-lg px-3 py-2">
                            <form
                                onSubmit={handleSubmit(submitNewProgress)}
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
                                    Enviar progresso
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </BaseDialog>
        </>
    );
}
