"use client";

import { useState } from "react";
import { PencilLine } from "lucide-react";

import { BookData } from "@/endpoints/queries/booksQueries";

import { FormReadReview, HandleAddNewProgressProps, HandleUpdateReadProps } from "./FormReadReview";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

interface ReadReviewDialogProps {
    readId?: string;
    bookData: BookData | null;
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
            <TooltipProvider delayDuration={400} skipDelayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon-sm"
                            variant="default"
                            onClick={() => handleToggleDialog(true)}
                        >
                            <PencilLine size={16} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={8}>
                        <span>Editar avaliação</span>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Avaliar livro - {bookData?.title}</DialogTitle>
                    </DialogHeader>

                    <div className="px-3 py-2">
                        <FormReadReview
                            readId={readId}
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
