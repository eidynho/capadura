"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { PencilLine } from "lucide-react";

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

    editData: {
        reviewContent?: string;
        reviewRating: number;
        reviewIsSpoiler: boolean;
    };
}

export function UpdateReadReviewDialog({
    readId,
    bookData,
    setUserReads,
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
                            setUserReads={setUserReads}
                            editData={editData}
                            bookData={bookData}
                            executeOnSubmit={() => setIsOpen(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
