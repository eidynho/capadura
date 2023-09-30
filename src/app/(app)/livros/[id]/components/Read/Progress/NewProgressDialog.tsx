"use client";

import { useState } from "react";

import { HandleAddNewProgressProps } from "../ReadReview/FormReadReview";

import { FormProgress, ProgressFormSchema } from "./FormProgress";

import {
    CardReadAction,
    CardReadActionDescription,
    CardReadActionPicture,
    CardReadActionTitle,
} from "../CardReadAction";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";
import { Leaves } from "@/components/svg/Leaves";

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
                    <CardReadAction>
                        <CardReadActionTitle>Adicionar progresso</CardReadActionTitle>
                        <CardReadActionDescription>
                            Compartilhe seu progresso com a comunidade.
                        </CardReadActionDescription>
                        <CardReadActionPicture className="-right-72 rotate-45">
                            <Leaves />
                        </CardReadActionPicture>
                    </CardReadAction>
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
