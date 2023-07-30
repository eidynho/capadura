"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { PlusCircle } from "phosphor-react";

import { api } from "@/lib/api";
import { ProgressData, ReadData } from "@/app/(app)/books/[id]/page";

import { FormReadProgress, ProgressFormSchema } from "./FormReadProgress";
import { Button } from "@/components/Button";
import { BaseDialog } from "@/components/radix-ui/BaseDialog";

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

                const read = updatedReads.find((read) => read.id === readId);
                if (read) {
                    if (!read.progress) {
                        read.progress = [];
                    }

                    if (read.progress.length === 3) {
                        read.progress.pop();
                    }

                    read.progress.unshift(data);
                }

                return updatedReads;
            });

            toast.success("Progresso adicionado.");
            setIsOpen(false);
        } catch (err) {
            toast.error("Erro ao adicionar um novo progresso.");
            throw err;
        }
    }

    return (
        <>
            <Button
                size="sm"
                onClick={() => handleToggleDialog(true)}
                className="w-full bg-yellow-500 text-black"
            >
                <PlusCircle size={20} weight="bold" />
                <span className="font-medium">Novo progresso</span>
            </Button>

            <BaseDialog
                size="max-w-3xl"
                title={`Progresso de leitura - ${bookTitle}`}
                isOpen={isOpen}
                closeDialog={() => handleToggleDialog(false)}
            >
                {/* Dialog body */}
                <div className="px-4 py-6">
                    <div className="mb-4">
                        <div className="flex items-start gap-8 rounded-lg px-3 py-2">
                            <FormReadProgress submitForm={submitNewProgress} />
                        </div>
                    </div>
                </div>
            </BaseDialog>
        </>
    );
}
