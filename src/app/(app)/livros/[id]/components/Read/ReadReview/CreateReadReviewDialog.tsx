"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import { BookData } from "@/app/(app)/livros/[id]/page";

import { FormReadReview, HandleAddNewProgressProps, HandleUpdateReadProps } from "./FormReadReview";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
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
                <DialogTrigger>
                    <Button size="sm" variant="outline">
                        <Star size={16} className="text-yellow-500" />
                        Avaliar
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
                            isReviewWithoutProgress={isReviewWithoutProgress}
                            bookData={bookData}
                            executeOnSubmit={() => setIsOpen(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
