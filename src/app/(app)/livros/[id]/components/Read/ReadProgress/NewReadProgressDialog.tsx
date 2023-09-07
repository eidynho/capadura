"use client";

import { useState } from "react";
import { BadgePlus } from "lucide-react";

import { HandleAddNewProgressProps } from "../ReadReview/FormReadReview";

import { FormReadProgress, ProgressFormSchema } from "./FormReadProgress";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";

interface NewReadProgressDialogProps {
    readId: string;
    bookTitle?: string;
    bookPageCount: number;
    handleAddNewProgress: (data: HandleAddNewProgressProps) => Promise<void>;
}

export function NewReadProgressDialog({
    readId,
    bookTitle,
    bookPageCount,
    handleAddNewProgress,
}: NewReadProgressDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    async function submitNewProgress({
        description,
        isSpoiler,
        pagesCount,
        countType,
    }: ProgressFormSchema) {
        try {
            await handleAddNewProgress({
                readId,
                description,
                isSpoiler,
                pagesCount,
                countType,
                bookPageCount,
            });

            setIsOpen(false);
        } catch (err) {
            throw err;
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger>
                    <Button size="sm" variant="primary">
                        <BadgePlus size={16} />
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

                    <DialogClose />
                </DialogContent>
            </Dialog>
        </>
    );
}
