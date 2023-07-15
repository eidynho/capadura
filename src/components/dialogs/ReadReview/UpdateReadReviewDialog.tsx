import { Dispatch, SetStateAction, useState } from "react";
import { PencilSimple } from "phosphor-react";

import { BookData, ReadData } from "@/pages/books/[id]";

import { BaseDialog } from "@/components/radix-ui/BaseDialog";
import { FormReadReview } from "./FormReadReview";

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
            <div
                onClick={() => handleToggleDialog(true)}
                tabIndex={0}
                className="cursor-pointer rounded-lg p-[6px] text-sm hover:bg-gray-400/20"
            >
                <PencilSimple size={17} weight="bold" />
            </div>

            <BaseDialog
                size="max-w-3xl"
                title={`Avaliar - ${bookData?.title}`}
                isOpen={isOpen}
                closeDialog={() => handleToggleDialog(false)}
            >
                {/* Dialog body */}
                <div className="px-4 py-6">
                    <div className="mb-4">
                        <div className="flex items-start gap-8 rounded-lg px-3 py-2">
                            <FormReadReview
                                readId={readId}
                                setUserReads={setUserReads}
                                editData={editData}
                                bookData={bookData}
                                executeOnSubmit={() => setIsOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            </BaseDialog>
        </>
    );
}
