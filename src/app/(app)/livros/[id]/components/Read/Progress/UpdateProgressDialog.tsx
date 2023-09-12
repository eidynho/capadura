"use client";

import { FormProgress, ProgressFormSchema } from "./FormProgress";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";

export interface HandleUpdateProgressProps {
    id: string;
    readId: string;
    description?: string;
    isSpoiler: boolean;
    pagesCount: number;
    countType: string;
    bookPageCount: number;
}

interface ProgressDialogProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;

    bookTitle?: string;
    bookPageCount: number;
    editData: {
        readId: string;
        id: string;
        description: string;
        isSpoiler: boolean;
        page: number | null;
        countType: "page" | "percentage";
    } | null;
    handleUpdateProgress: (data: HandleUpdateProgressProps) => Promise<void>;
}

export function UpdateProgressDialog({
    isOpen,
    setIsOpen,
    bookTitle,
    bookPageCount,
    editData,
    handleUpdateProgress,
}: ProgressDialogProps) {
    async function updateProgress({
        description,
        isSpoiler,
        pagesCount,
        countType,
    }: ProgressFormSchema) {
        try {
            if (!editData?.id) {
                throw new Error("Missing id to update progress");
            }

            await handleUpdateProgress({
                id: editData.id,
                readId: editData.readId,
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Progresso de leitura - {bookTitle}</DialogTitle>
                </DialogHeader>

                <div className="px-3 py-2">
                    <FormProgress editData={editData} submitForm={updateProgress} />
                </div>

                <DialogClose />
            </DialogContent>
        </Dialog>
    );
}
