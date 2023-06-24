import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Image as ImageIcon, PlusCircle } from "phosphor-react";

import { api } from "@/lib/api";
import { BookData } from "@/pages/app/books/[id]";
import { BaseModal } from "../headless-ui/BaseModal";
import { Button } from "../Button";

const progressFormSchema = z.object({
    description: z.string().optional(),
    isSpoiler: z.boolean().default(false),
    pagesCount: z.coerce.number().nonnegative().min(1, "Campo obrigatório"),
    countType: z.enum(["page", "percentage"]),
});

type ProgressFormSchema = z.infer<typeof progressFormSchema>;

interface ReadProgressModalProps {
    bookData: BookData;
    readId: string;
}

export function ReadProgressModal({ bookData, readId }: ReadProgressModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    function handleToggleModal(state = false) {
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
            await api.post("/progress", {
                readId,
                description,
                isSpoiler,
                pagesCount,
                countType,
                bookPageCount: bookData.pageCount,
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
            <Button size="sm" onClick={() => handleToggleModal(true)}>
                <PlusCircle size={20} />
                <span className="font-medium">Novo progresso</span>
            </Button>

            <BaseModal
                size="max-w-3xl"
                title={`Progresso de leitura - ${bookData.title}`}
                isOpen={isOpen}
                toggleModal={() => handleToggleModal(false)}
            >
                {/* Modal body */}
                <div className="px-4 py-6">
                    <div className="mb-4">
                        <div className="flex items-start gap-8 rounded-lg px-3 py-2">
                            <div className="flex flex-col items-center gap-2">
                                {bookData.image ? (
                                    <Image
                                        src={bookData.image}
                                        alt={`Capa do livro ${bookData.title}`}
                                        title={`Capa do livro ${bookData.title}`}
                                        width={120}
                                        height={170}
                                        priority={true}
                                        className="rounded-lg"
                                    />
                                ) : (
                                    <div className="flex h-40 w-28 flex-col items-center justify-center rounded-md border border-black bg-gray-300 opacity-70">
                                        <ImageIcon size={40} />
                                        <span className="text-xs">Sem imagem</span>
                                    </div>
                                )}

                                {bookData.pageCount && (
                                    <span className="text-xs font-semibold">
                                        {bookData.pageCount} páginas
                                    </span>
                                )}
                            </div>

                            <form
                                onSubmit={handleSubmit(submitNewProgress)}
                                className="flex flex-1 flex-col gap-4"
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
                                    <div className="flex items-center gap-4">
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
            </BaseModal>
        </>
    );
}
