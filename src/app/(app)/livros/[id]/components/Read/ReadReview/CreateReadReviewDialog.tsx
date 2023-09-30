"use client";

import { useState } from "react";

import { BookData } from "@/endpoints/queries/booksQueries";

import { FormReadReview, HandleAddNewProgressProps, HandleUpdateReadProps } from "./FormReadReview";

import {
    CardReadAction,
    CardReadActionDescription,
    CardReadActionPicture,
    CardReadActionTitle,
} from "../CardReadAction";
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
    handleStartNewRead: () => Promise<string | undefined>;
    handleUpdateRead: (data: HandleUpdateReadProps) => Promise<void>;
    handleAddNewProgress: (data: HandleAddNewProgressProps) => Promise<void>;

    isReviewWithoutProgress?: boolean;
}

export function CreateReadReviewDialog({
    readId,
    bookData,
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
                    <CardReadAction>
                        <CardReadActionTitle>Avaliar livro</CardReadActionTitle>
                        <CardReadActionDescription>
                            {readId
                                ? "Compartilhe o que achou do livro."
                                : "Li esse livro anteriormente e quero avaliar."}
                        </CardReadActionDescription>
                        <CardReadActionPicture className="-right-16 rotate-45">
                            <ChaosWavy />
                        </CardReadActionPicture>
                    </CardReadAction>
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
