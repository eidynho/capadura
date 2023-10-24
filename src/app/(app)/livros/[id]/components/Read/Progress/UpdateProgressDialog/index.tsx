"use client";

import { FormUpdateDialog, HandleUpdateProgressProps } from "./FormUpdateProgress";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";

interface UpdateProgressDialogProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;

    bookTitle?: string;
    bookPageCount: number;
    editData: {
        readId: string;
        id: string;
        description: string;
        isSpoiler: boolean;
        page: number;
        percentage: number;
        countType: "page" | "percentage";
    };
    handleUpdateProgress: (data: HandleUpdateProgressProps) => Promise<void>;
}

export function UpdateProgressDialog({
    isOpen,
    setIsOpen,
    bookTitle,
    bookPageCount,
    editData,
    handleUpdateProgress,
}: UpdateProgressDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Progresso de leitura - {bookTitle}</DialogTitle>
                </DialogHeader>

                <div className="px-3 py-2">
                    <FormUpdateDialog
                        bookPageCount={bookPageCount}
                        editData={editData}
                        handleUpdateProgress={handleUpdateProgress}
                        setIsOpen={setIsOpen}
                    />
                </div>

                <DialogClose />
            </DialogContent>
        </Dialog>
    );
}
