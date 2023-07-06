import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { CircleNotch, PlusCircle, Star, StarHalf } from "phosphor-react";

import { api } from "@/lib/api";
import { ReadData } from "@/pages/app/books/[id]";
import { BaseDialog } from "../radix-ui/BaseDialog";
import { Button } from "../Button";

export const readReviewFormSchema = z.object({
    content: z.string().optional(),
    rating: z.number().max(5, "Valor incorreto."),
    isSpoiler: z.boolean().default(false),
});

export type ReviewReadFormSchema = z.infer<typeof readReviewFormSchema>;

interface ReadReviewDialogProps {
    readId: string;
    bookTitle?: string;
    setUserReads: Dispatch<SetStateAction<ReadData[] | null>>;
}

export function ReadReviewDialog({
    readId,
    bookTitle,

    setUserReads,
}: ReadReviewDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState("h-40");
    const [hoverPositionRating, setHoverPositionRating] = useState<number>(0);
    const [rating, setRating] = useState<number | null>(null);

    function handleToggleDialog(state = false) {
        setIsOpen(state);
    }

    useEffect(() => {
        const formatedRating = formatRating();
        if (formatedRating) {
            setValue("rating", formatedRating);
            trigger("rating");
        }
    }, [rating]);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset,
        setValue,
        trigger,
    } = useForm<ReviewReadFormSchema>({
        resolver: zodResolver(readReviewFormSchema),
        defaultValues: {
            isSpoiler: false,
        },
    });

    async function sendReview({ content, rating, isSpoiler }: ReviewReadFormSchema) {
        try {
            await api.put("/read", {
                readId,
                status: "FINISHED",
                reviewContent: content,
                reviewRating: rating,
                reviewIsSpoiler: isSpoiler,
                endRead: true,
            });

            setUserReads((prev) => {
                if (!prev) return null;

                const updatedReads = [...prev];

                const read = updatedReads.find((read) => read.id === readId);
                if (read) {
                    read.status = "FINISHED";
                    read.review_content = content ?? null;
                    read.review_rating = rating;
                    read.review_is_spoiler = isSpoiler;
                    read.end_date = new Date().toISOString();
                }

                return updatedReads;
            });

            toast.success("Avalição adicionada.");
            setIsOpen(false);

            reset();
        } catch (err) {
            toast.error("Erro ao adicionar uma avaliação.");
            throw err;
        }
    }

    const handleHoverEnterRating = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            const { clientX, currentTarget } = event;

            const rect = currentTarget.getBoundingClientRect();
            const relativeX = (clientX - rect.left) / rect.width;

            setHoverPositionRating(relativeX);
        },
        [setHoverPositionRating],
    );

    function formatRating() {
        if (!rating) return null;

        switch (true) {
            case rating <= 0.1:
                return 0.0;
            case rating <= 0.175:
                return 0.5;
            case rating <= 0.3:
                return 1.0;
            case rating <= 0.375:
                return 1.5;
            case rating <= 0.5:
                return 2.0;
            case rating <= 0.575:
                return 2.5;
            case rating <= 0.7:
                return 3.0;
            case rating <= 0.775:
                return 3.5;
            case rating <= 0.9:
                return 4.0;
            case rating <= 0.95:
                return 4.5;
            case rating > 0.95:
                return 5.0;
        }
    }

    return (
        <>
            <Button
                size="sm"
                className="enabled:hover:bg-green-500 enabled:hover:text-white"
                onClick={() => handleToggleDialog(true)}
            >
                <Star size={18} weight="bold" />
                <span className="font-medium">Avaliar</span>
            </Button>

            <BaseDialog
                size="max-w-3xl"
                title={`Avaliar - ${bookTitle}`}
                isOpen={isOpen}
                closeDialog={() => handleToggleDialog(false)}
            >
                {/* Dialog body */}
                <div className="px-4 py-6">
                    <div className="mb-4">
                        <div className="flex items-start gap-8 rounded-lg px-3 py-2">
                            <form
                                onSubmit={handleSubmit(sendReview)}
                                className="flex w-full flex-col gap-4"
                            >
                                <div>
                                    <label
                                        htmlFor="content-read-review"
                                        className="flex items-center gap-1 text-sm font-semibold text-black"
                                    >
                                        Avaliação
                                    </label>
                                    <textarea
                                        {...register("content")}
                                        name="content"
                                        id="content-read-review"
                                        onClick={() => setContentHeight("h-80")}
                                        placeholder="Escreva sua avaliação..."
                                        className={`${contentHeight} mt-1 block w-full rounded-lg border border-black bg-white bg-opacity-60 px-3 py-2 text-sm outline-none transition-all focus:border-yellow-500`}
                                    ></textarea>

                                    <div className="mt-2 flex items-start justify-between">
                                        <div className="mt-1 flex items-center gap-x-3">
                                            <div className="flex h-6 items-center">
                                                <input
                                                    {...register("isSpoiler")}
                                                    name="isSpoiler"
                                                    id="is-spoiler-read-review"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded-lg accent-yellow-500 outline-yellow-500 focus:ring-yellow-400"
                                                />
                                            </div>
                                            <div className="text-sm leading-6">
                                                <label
                                                    htmlFor="is-spoiler-read-review"
                                                    className="font-medium text-black"
                                                >
                                                    Contém spoiler
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold">
                                                        Nota
                                                    </span>
                                                    <span className="text-xs font-semibold">
                                                        {`${
                                                            formatRating()?.toFixed(1) ?? "----"
                                                        } / 5.0`}
                                                    </span>
                                                </div>
                                                <div
                                                    onClick={() => setRating(hoverPositionRating)}
                                                    onMouseMove={handleHoverEnterRating}
                                                    onMouseLeave={() => setHoverPositionRating(0)}
                                                    className="relative flex items-center"
                                                    tabIndex={0}
                                                >
                                                    {[
                                                        { half: 0.1, full: 0.175 },
                                                        { half: 0.3, full: 0.375 },
                                                        { half: 0.5, full: 0.575 },
                                                        { half: 0.7, full: 0.775 },
                                                        { half: 0.9, full: 0.95 },
                                                    ].map((star) => {
                                                        const isHalf =
                                                            (hoverPositionRating || rating || 0) >
                                                            star.half;

                                                        const isFull =
                                                            (hoverPositionRating || rating || 0) >
                                                            star.full;

                                                        const Component =
                                                            isHalf && !isFull ? StarHalf : Star;

                                                        return (
                                                            <Component
                                                                key={star.full}
                                                                size={26}
                                                                weight={
                                                                    isFull || isHalf
                                                                        ? "fill"
                                                                        : undefined
                                                                }
                                                                className="text-yellow-500"
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            {errors.rating && (
                                                <span className="text-xs font-semibold text-red-500">
                                                    Preencha a nota
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    size="md"
                                    type="submit"
                                    className="w-full bg-black text-white enabled:hover:bg-green-500 enabled:hover:text-white"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <CircleNotch
                                                size={22}
                                                weight="bold"
                                                className="animate-spin"
                                            />
                                            <span>Enviando...</span>
                                        </>
                                    ) : (
                                        <span>Enviar avaliação</span>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </BaseDialog>
        </>
    );
}
