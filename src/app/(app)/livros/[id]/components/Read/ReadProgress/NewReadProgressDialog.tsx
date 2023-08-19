"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { BadgePlus } from "lucide-react";
import { toast } from "react-toastify";

import { api } from "@/lib/api";
import { ProgressData, ReadData } from "@/app/(app)/livros/[id]/page";

import { FormReadProgress, ProgressFormSchema } from "./FormReadProgress";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";

interface NewReadProgressDialogProps {
    readId: string;
    bookId?: string;
    bookTitle?: string;
    bookPageCount: number;
    setUserReads: Dispatch<SetStateAction<ReadData[] | null>>;
}

export function NewReadProgressDialog({
    readId,
    bookId,
    bookTitle,
    bookPageCount,

    setUserReads,
}: NewReadProgressDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    async function submitNewProgress({
        description,
        isSpoiler,
        pagesCount,
        countType,
    }: ProgressFormSchema) {
        try {
            const { data } = await api.post<ProgressData>("/progress", {
                bookId,
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
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger>
                    <Button size="sm" variant="outline">
                        <BadgePlus size={16} className="text-pink-500" />
                        Novo progresso
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Progresso de leitura - {bookTitle}</DialogTitle>
                    </DialogHeader>

                    <div className="px-3 py-2">
                        <FormReadProgress submitForm={submitNewProgress} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
