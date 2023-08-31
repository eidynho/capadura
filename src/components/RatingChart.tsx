"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, StarHalf } from "phosphor-react";
import { BarChart, Bar, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "react-toastify";

import { useFetchReadsRating } from "@/endpoints/queries/readsQueries";

import { RatingStars } from "./RatingStars";

export interface ratingsDataChart {
    data: {
        rating: number;
        amount: number;
        percentage: number;
    }[];
    total: number;
    averageRating: number;
}

interface RatingChartProps {
    bookId?: string;
    userId?: string;
    username?: string;
}
export function RatingChart({ bookId, userId, username }: RatingChartProps) {
    if (!bookId && !userId) return;

    const router = useRouter();

    const [barGraphData, setBarGraphData] = useState({ x: 0, y: 0 });

    const { data: bookRatings, isError: isErrorBookRatings } = useFetchReadsRating({
        bookId,
        userId,
    });

    if (isErrorBookRatings) {
        toast.error("Não foi possível exibir as avaliações.");
        return;
    }
    if (!bookRatings) return;

    function handleClickBar({ rating }: { rating: number }) {
        router.push(`/${username ? `@${username}` : bookId}/ratings/${rating}`);
    }

    function RenderTooltipContent({ payload }: any) {
        const data = payload?.[0]?.payload;
        if (!data) return <></>;

        return (
            <div className="flex items-center rounded-md border border-dark bg-white/95 px-2 py-1 text-xs font-semibold">
                <span className="mr-1">{data.amount}</span>
                <RatingStars rating={data.rating} size={12} />
                <span className="ml-1">avaliações ({data.percentage}%)</span>
            </div>
        );
    }

    return (
        <div className="mt-2 flex flex-col justify-center rounded-md border bg-white px-4 pb-6 pt-4 text-sm transition-colors dark:bg-dark">
            <div className="my-1 flex items-center justify-between">
                <h3 className="font-semibold text-black dark:text-white">Avaliações</h3>
                <div className="flex items-center gap-1">
                    <Star size={14} weight="fill" className="text-black dark:text-white" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {bookRatings.averageRating.toFixed(2)} ({bookRatings.total})
                    </p>
                </div>
            </div>

            {bookRatings.total > 0 ? (
                <div className="flex items-end">
                    <div className="mb-[6px]">
                        <StarHalf size={14} weight="fill" className="text-black dark:text-white" />
                    </div>

                    <ResponsiveContainer width="100%" height={96}>
                        <BarChart data={bookRatings.data}>
                            <Tooltip
                                content={<RenderTooltipContent />}
                                cursor={<rect fill="#e4e4e7" />}
                                position={{ x: barGraphData.x, y: barGraphData.y - 30 }}
                                animationDuration={300}
                            />
                            <Bar
                                dataKey="percentage"
                                onClick={handleClickBar}
                                minPointSize={2}
                                onMouseOver={(data) => setBarGraphData(data)}
                                radius={[4, 4, 0, 0]}
                            >
                                {bookRatings.data.map((entry) => (
                                    <Cell
                                        cursor="pointer"
                                        key={`cell-${entry.rating}`}
                                        className="fill-primary"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="mb-[6px] flex flex-col text-black dark:text-white">
                        <Star size={14} weight="fill" />
                        <Star size={14} weight="fill" />
                        <Star size={14} weight="fill" />
                        <Star size={14} weight="fill" />
                        <Star size={14} weight="fill" />
                    </div>
                </div>
            ) : (
                <div className="mt-5 text-center text-black dark:text-white">
                    Nenhuma avaliação encontrada.
                </div>
            )}
        </div>
    );
}
