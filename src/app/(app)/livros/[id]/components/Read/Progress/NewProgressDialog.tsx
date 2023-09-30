"use client";

import { useState } from "react";

import { HandleAddNewProgressProps } from "../ReadReview/FormReadReview";

import { FormProgress, ProgressFormSchema } from "./FormProgress";

import {
    CardAction,
    CardActionDescription,
    CardActionPicture,
    CardActionTitle,
} from "@/components/ui/CardAction";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";
import { Wavy } from "@/components/svg/Wavy";

interface NewProgressDialogProps {
    readId: string;
    bookTitle?: string;
    bookPageCount: number;
    handleAddNewProgress: (data: HandleAddNewProgressProps) => Promise<void>;
}

export function NewProgressDialog({
    readId,
    bookTitle,
    bookPageCount,
    handleAddNewProgress,
}: NewProgressDialogProps) {
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
                <DialogTrigger asChild>
                    <CardAction>
                        <CardActionTitle>Adicionar progresso</CardActionTitle>
                        <CardActionDescription>
                            Compartilhe seu progresso com a comunidade.
                        </CardActionDescription>
                        <CardActionPicture className="-right-20 -top-20 -rotate-[36deg]">
                            <Wavy />
                        </CardActionPicture>
                    </CardAction>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Progresso de leitura - {bookTitle}</DialogTitle>
                    </DialogHeader>

                    <div className="px-3 py-2">
                        <FormProgress submitForm={submitNewProgress} />
                    </div>

                    <DialogClose />
                </DialogContent>
            </Dialog>
        </>
    );
}
