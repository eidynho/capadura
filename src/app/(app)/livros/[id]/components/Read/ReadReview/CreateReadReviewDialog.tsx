"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Star } from "phosphor-react";

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

    function handleToggleDialog(state = false) {
        setIsOpen(state);
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger>
                    {isReviewWithoutProgress ? (
                        <Button
                            size="sm"
                            onClick={() => handleToggleDialog(true)}
                            className="group gap-1 bg-transparent px-4 text-black enabled:hover:bg-yellow-500"
                        >
                            <Star
                                size={20}
                                className="text-yellow-500 transition-colors group-hover:text-black"
                            />

                            <div className="flex flex-col items-start">
                                <span className="font-medium">Avaliar</span>
                            </div>
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            className="w-full bg-green-500 enabled:hover:bg-green-500 enabled:hover:text-white"
                            onClick={() => handleToggleDialog(true)}
                        >
                            <Star size={18} weight="bold" />
                            <span className="font-medium">Avaliar</span>
                        </Button>
                    )}
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
