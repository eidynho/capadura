import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

import { api } from "@/lib/api";
import { ReadData } from "@/pages/app/books/[id]";

import { FormReadProgress, ProgressFormSchema } from "./FormReadProgress";
import { BaseDialog } from "@/components/radix-ui/BaseDialog";

interface ReadProgressDialogProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setUserReads: Dispatch<SetStateAction<ReadData[] | null>>;

    bookTitle?: string;
    bookPageCount: number;
    editData: {
        readId: string;
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
    setUserReads,
    bookTitle,
    bookPageCount,
    editData,
}: ReadProgressDialogProps) {
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

            toast.success("Progresso atualizado.");

            // update front-end
            setUserReads((prev) => {
                if (!prev) return null;

                const updatedReads = [...prev];

                const read = updatedReads.find((read) => read.id === editData?.readId);
                if (read) {
                    const progress = read.progress.find((progress) => progress.id === editData?.id);
                    if (!progress) return updatedReads;

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

                    if (percentage >= 100) {
                        page = bookPageCount;
                        percentage = 100;
                    }

                    progress.description = description ?? "";
                    progress.is_spoiler = isSpoiler;
                    progress.page = page;
                    progress.percentage = percentage;
                }

                return updatedReads;
            });

            setIsOpen(false);
        } catch (err) {
            toast.error("Erro ao atualizar o progresso.");
            throw err;
        }
    }

    return (
        <BaseDialog
            size="max-w-3xl"
            title={`Progresso de leitura - ${bookTitle}`}
            isOpen={isOpen}
            closeDialog={() => setIsOpen(false)}
        >
            {/* Dialog body */}
            <div className="px-4 py-6">
                <div className="mb-4">
                    <div className="flex items-start gap-8 rounded-lg px-3 py-2">
                        <FormReadProgress editData={editData} submitForm={updateProgress} />
                    </div>
                </div>
            </div>
        </BaseDialog>
    );
}
