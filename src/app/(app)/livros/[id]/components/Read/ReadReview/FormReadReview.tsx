"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, StarHalf } from "phosphor-react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { BookData } from "@/endpoints/queries/booksQueries";
import { ReadStatus } from "@/endpoints/mutations/readsMutations";

import { ratingFormat } from "@/utils/rating-format";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

const readReviewFormSchema = z.object({
    content: z.string().optional(),
    rating: z.number().refine((value) => value >= 0 && value <= 5),
    isSpoiler: z.boolean().default(false),
});

export interface HandleAddNewProgressProps {
    readId: string;
    description?: string;
    isSpoiler: boolean;
    pagesCount: number;
    countType: "page" | "percentage";
    bookPageCount: number;
}

export interface HandleUpdateReadProps {
    readId: string;
    status: ReadStatus;
    reviewContent?: string;
    reviewRating: number | null;
    reviewIsSpoiler: boolean;
    endRead: boolean;
}

type ReviewReadFormSchema = z.infer<typeof readReviewFormSchema>;

interface FormReadReviewProps {
    readId?: string;
    handleStartNewRead: () => Promise<string | undefined>;
    handleUpdateRead: (data: HandleUpdateReadProps) => Promise<void>;
    handleAddNewProgress: (data: HandleAddNewProgressProps) => Promise<void>;
    isReviewWithoutProgress?: boolean;
    bookData: BookData | null;
    executeOnSubmit: () => void;

    editData?: {
        reviewContent?: string;
        reviewRating: number;
        reviewIsSpoiler: boolean;
    };
}

export function FormReadReview({
    readId,
    handleStartNewRead,
    handleUpdateRead,
    handleAddNewProgress,
    isReviewWithoutProgress,
    bookData,
    executeOnSubmit,
    editData,
}: FormReadReviewProps) {
    const [contentHeight, setContentHeight] = useState("h-40");
    const [hoverPositionRating, setHoverPositionRating] = useState<number>(0);
    const [rating, setRating] = useState<number | null>(null);

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

    useEffect(() => {
        const formatedRating = ratingFormat(rating, true);

        if (typeof formatedRating === "number") {
            setValue("rating", formatedRating);
            trigger("rating");
        }
    }, [rating]);

    useEffect(() => {
        if (!editData) return;

        setValue("content", editData.reviewContent);
        setValue("isSpoiler", editData.reviewIsSpoiler);

        const unformatedRating = ratingFormat(editData.reviewRating, false);
        setRating(unformatedRating);
    }, [editData]);

    async function submitReview({ content, rating, isSpoiler }: ReviewReadFormSchema) {
        try {
            if (!bookData?.id) {
                toast.error("Ocorreu um erro ao enviar avaliação.");
                throw new Error("Failed on submit book review: book data not provided.");
            }

            let newlyCreatedRead: string | undefined = "";
            if (isReviewWithoutProgress) {
                const createdReadId = await handleStartNewRead();
                newlyCreatedRead = createdReadId;

                await handleAddNewProgress({
                    readId: newlyCreatedRead as string,
                    isSpoiler: false,
                    pagesCount: 100,
                    countType: "percentage",
                    bookPageCount: bookData.pageCount || 0,
                });
            }

            await handleUpdateRead({
                readId: (readId ?? newlyCreatedRead) as string,
                status: "FINISHED",
                reviewContent: content,
                reviewRating: rating,
                reviewIsSpoiler: isSpoiler,
                endRead: !editData,
            });

            toast.success("Avalição adicionada.");
            executeOnSubmit();

            reset();
        } catch (err) {
            toast.error("Erro ao avaliar o livro.");
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

    return (
        <form
            onSubmit={handleSubmit(submitReview)}
            className="flex w-full flex-col gap-4 text-black dark:text-white"
        >
            <div>
                <label
                    htmlFor="content-read-review"
                    className="flex items-center gap-1 text-sm font-semibold"
                >
                    Avaliação
                </label>
                <Textarea
                    {...register("content")}
                    name="content"
                    id="content-read-review"
                    onClick={() => setContentHeight("h-80")}
                    placeholder="Escreva sua avaliação..."
                    className={`${contentHeight} mt-1 transition-all`}
                ></Textarea>

                <div className="mt-2 flex items-start justify-between">
                    <div className="flex h-6 items-center gap-2">
                        <input
                            {...register("isSpoiler")}
                            name="isSpoiler"
                            type="checkbox"
                            id="is-spoiler-read-review"
                            className="h-4 w-4 accent-primary"
                        />
                        <Label htmlFor="is-spoiler-read-review">Contém spoiler</Label>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">Nota</span>
                                <span className="text-xs font-semibold">
                                    {`${ratingFormat(rating, true)?.toFixed(1) ?? "----"} / 5.0`}
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
                                    const isHalf = (hoverPositionRating || rating || 0) > star.half;

                                    const isFull = (hoverPositionRating || rating || 0) > star.full;

                                    const Component = isHalf && !isFull ? StarHalf : Star;

                                    return (
                                        <Component
                                            key={star.full}
                                            size={26}
                                            weight={isFull || isHalf ? "fill" : undefined}
                                            className="text-primary"
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        {errors.rating && (
                            <span className="mt-1 text-xs font-medium text-destructive">
                                Preencha a nota
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <Button size="sm" variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 size={22} className="animate-spin" />
                        <span>Avaliando...</span>
                    </>
                ) : (
                    <span>Avaliar</span>
                )}
            </Button>
        </form>
    );
}
