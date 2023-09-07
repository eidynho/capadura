"use client";

import { useState } from "react";
import { PencilLine } from "lucide-react";

import { BookData } from "@/app/(app)/livros/[id]/page";

import { FormReadReview, HandleAddNewProgressProps, HandleUpdateReadProps } from "./FormReadReview";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";

interface ReadReviewDialogProps {
    readId?: string;
    bookData: BookData | null;
    handleStartNewRead: () => Promise<string | undefined>;
    handleUpdateRead: (data: HandleUpdateReadProps) => Promise<void>;
    handleAddNewProgress: (data: HandleAddNewProgressProps) => Promise<void>;

    editData: {
        reviewContent?: string;
        reviewRating: number;
        reviewIsSpoiler: boolean;
    };
}

export function UpdateReadReviewDialog({
    readId,
    bookData,
    handleStartNewRead,
    handleUpdateRead,
    handleAddNewProgress,
    editData,
}: ReadReviewDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    function handleToggleDialog(state = false) {
        setIsOpen(state);
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger>
                    <Button
                        size="icon-sm"
                        variant="default"
                        onClick={() => handleToggleDialog(true)}
                    >
                        <PencilLine size={16} />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Avaliar livro - {bookData?.title}</DialogTitle>
                    </DialogHeader>

                    <div className="px-3 py-2">
                        <FormReadReview
                            readId={readId}
                            handleStartNewRead={handleStartNewRead}
                            handleUpdateRead={handleUpdateRead}
                            handleAddNewProgress={handleAddNewProgress}
                            editData={editData}
                            bookData={bookData}
                            executeOnSubmit={() => setIsOpen(false)}
                        />
                    </div>

                    <DialogClose />
                </DialogContent>
            </Dialog>
        </>
    );
}
