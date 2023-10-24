"use client";

import { useState } from "react";

import { HandleAddNewProgressProps } from "../../ReadReview/FormReadReview";
import { FormCreateProgress, ProgressFormSchema } from "./FormCreateProgress";

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

interface CreateProgressDialogProps {
    readId: string;
    bookTitle?: string;
    bookPageCount: number;
    palette: string[];
    handleAddNewProgress: (data: HandleAddNewProgressProps) => Promise<void>;
}

export function CreateProgressDialog({
    readId,
    bookTitle,
    bookPageCount,
    palette,
    handleAddNewProgress,
}: CreateProgressDialogProps) {
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
                            <Wavy palette={palette} />
                        </CardActionPicture>
                    </CardAction>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Progresso de leitura - {bookTitle}</DialogTitle>
                    </DialogHeader>

                    <div className="px-3 py-2">
                        <FormCreateProgress submitForm={submitNewProgress} />
                    </div>

                    <DialogClose />
                </DialogContent>
            </Dialog>
        </>
    );
}
