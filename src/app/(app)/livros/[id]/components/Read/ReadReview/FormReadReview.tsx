"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, StarHalf } from "phosphor-react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { BookData, ReadData } from "@/app/(app)/livros/[id]/page";

import { api } from "@/lib/api";
import { ratingFormat } from "@/utils/rating-format";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

const readReviewFormSchema = z.object({
    content: z.string().optional(),
    rating: z.number().refine((value) => value >= 0 && value <= 5),
    isSpoiler: z.boolean().default(false),
});

type ReviewReadFormSchema = z.infer<typeof readReviewFormSchema>;

interface FormReadReviewProps {
    readId?: string;
    setUserReads: Dispatch<SetStateAction<ReadData[] | null>>;
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
    setUserReads,
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
            let newlyCreatedRead = "";
            if (isReviewWithoutProgress && bookData?.id) {
                try {
                    const readResponse = await api.post("/read", {
                        bookId: bookData?.id,
                    });

                    setUserReads([readResponse.data]);
                    newlyCreatedRead = readResponse.data.id;
                } catch (err) {
                    throw err;
                }

                try {
                    const progressResponse = await api.post("/progress", {
                        readId: newlyCreatedRead,
                        isSpoiler: false,
                        pagesCount: 100,
                        countType: "percentage",
                        bookPageCount: bookData?.pageCount,
                    });

                    setUserReads((prev) => {
                        if (!prev) return null;

                        const updatedReads = [...prev];

                        const read = updatedReads.find((read) => read.id === newlyCreatedRead);
                        if (read) {
                            read.progress = [progressResponse.data];
                        }

                        return updatedReads;
                    });
                } catch (err) {
                    throw err;
                }
            }

            await api.put("/read", {
                readId: readId ?? newlyCreatedRead,
                status: "FINISHED",
                reviewContent: content,
                reviewRating: rating,
                reviewIsSpoiler: isSpoiler,
                endRead: !editData,
            });

            setUserReads((prev) => {
                if (!prev) return null;

                const updatedReads = [...prev];

                const read = updatedReads.find((read) => read.id === (readId ?? newlyCreatedRead));
                if (read) {
                    read.status = "FINISHED";
                    read.reviewContent = content ?? null;
                    read.reviewRating = rating;
                    read.reviewIsSpoiler = isSpoiler;
                    read.endDate = new Date().toISOString();
                }

                return updatedReads;
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
        <form onSubmit={handleSubmit(submitReview)} className="flex w-full flex-col gap-4">
            <div>
                <label
                    htmlFor="content-read-review"
                    className="flex items-center gap-1 text-sm font-semibold text-black"
                >
                    Avaliação
                </label>
                <Textarea
                    {...register("content")}
                    name="content"
                    id="content-read-review"
                    onClick={() => setContentHeight("h-80")}
                    placeholder="Escreva sua avaliação..."
                    className={`${contentHeight} mt-1 bg-white transition-all`}
                ></Textarea>

                <div className="mt-2 flex items-start justify-between">
                    <div className="flex h-6 items-center gap-2">
                        <input
                            {...register("isSpoiler")}
                            name="isSpoiler"
                            type="checkbox"
                            id="is-spoiler-read-review"
                            className="h-4 w-4 accent-black outline-black"
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
                                            className="text-yellow-500"
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

            <Button size="sm" variant="success" type="submit" disabled={isSubmitting}>
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
