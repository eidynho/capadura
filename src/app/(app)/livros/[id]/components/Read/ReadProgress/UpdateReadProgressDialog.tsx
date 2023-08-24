"use client";

import { FormReadProgress, ProgressFormSchema } from "./FormReadProgress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";

export interface HandleUpdateProgressProps {
    id: string;
    readId: string;
    description?: string;
    isSpoiler: boolean;
    pagesCount: number;
    countType: string;
    bookPageCount: number;
}

interface ReadProgressDialogProps {
    isOpen: boolean;
    handleOpenUpdateProgressDialog: (value: boolean) => void;

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

export function UpdateReadProgressDialog({
    isOpen,
    handleOpenUpdateProgressDialog,
    bookTitle,
    bookPageCount,
    editData,
    handleUpdateProgress,
}: ReadProgressDialogProps) {
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

            handleOpenUpdateProgressDialog(false);
        } catch (err) {
            throw err;
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenUpdateProgressDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Progresso de leitura - {bookTitle}</DialogTitle>
                </DialogHeader>

                <div className="px-3 py-2">
                    <FormReadProgress editData={editData} submitForm={updateProgress} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
