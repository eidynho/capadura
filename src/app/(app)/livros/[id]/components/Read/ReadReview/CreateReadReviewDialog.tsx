"use client";

import { useState } from "react";

import { BookData } from "@/endpoints/queries/booksQueries";

import { FormReadReview, HandleAddNewProgressProps, HandleUpdateReadProps } from "./FormReadReview";

import {
    CardAction,
    CardActionDescription,
    CardActionPicture,
    CardActionTitle,
} from "@/components/ui/CardAction";
import { ChaosWavy } from "@/components/svg/ChaosWavy";
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
    palette: string[];
    handleStartNewRead?: () => Promise<string | undefined>;
    handleUpdateRead: (data: HandleUpdateReadProps) => Promise<void>;
    handleAddNewProgress: (data: HandleAddNewProgressProps) => Promise<void>;
    isReviewWithoutProgress?: boolean;
}

export function CreateReadReviewDialog({
    readId,
    bookData,
    palette,
    handleStartNewRead,
    handleUpdateRead,
    handleAddNewProgress,
    isReviewWithoutProgress,
}: ReadReviewDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <CardAction>
                        <CardActionTitle>Avaliar livro</CardActionTitle>
                        <CardActionDescription>
                            {readId
                                ? "Compartilhe o que achou do livro."
                                : "Li esse livro anteriormente e quero avaliar."}
                        </CardActionDescription>
                        <CardActionPicture className="-right-16 rotate-45">
                            <ChaosWavy palette={palette} />
                        </CardActionPicture>
                    </CardAction>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Avaliar livro</DialogTitle>
                    </DialogHeader>

                    <div className="px-3 py-2">
                        <FormReadReview
                            readId={readId}
                            handleStartNewRead={handleStartNewRead}
                            handleUpdateRead={handleUpdateRead}
                            handleAddNewProgress={handleAddNewProgress}
                            isReviewWithoutProgress={isReviewWithoutProgress}
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
