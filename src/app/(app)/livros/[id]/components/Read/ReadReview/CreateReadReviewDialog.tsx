"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Star } from "lucide-react";

import { BookData, ReadData } from "@/app/(app)/livros/[id]/page";

import { FormReadReview } from "./FormReadReview";
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
    setUserReads: Dispatch<SetStateAction<ReadData[] | null>>;

    isReviewWithoutProgress?: boolean;
}

export function CreateReadReviewDialog({
    readId,
    bookData,
    setUserReads,
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
                            setUserReads={setUserReads}
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
