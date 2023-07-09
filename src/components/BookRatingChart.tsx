import { useEffect, useState } from "react";
import Router from "next/router";
import { Star, StarHalf } from "phosphor-react";
import { BarChart, Bar, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { RatingStars } from "./RatingStars";
import { api } from "@/lib/api";
import { toast } from "react-toastify";

interface bookRatings {
    data: {
        rating: number;
        amount: number;
        percentage: number;
    }[];
    total: number;
    averageRating: number;
}

interface BookRatingChartProps {
    bookId: string;
}
export function BookRatingChart({ bookId }: BookRatingChartProps) {
    const [bookRatings, setBookRatings] = useState<bookRatings>({
        data: [],
        total: 0,
        averageRating: 0,
    });
    const [barGraphData, setBarGraphData] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!bookId) return;

        async function getBookRatings() {
            try {
                const { data } = await api.get(`/${bookId}/ratings`);

                setBookRatings(data);
            } catch (err) {
                toast("Não foi possível exibir a nota do livro.");
                throw err;
            }
        }
        getBookRatings();
    }, [bookId]);

    function handleClickBar({ rating }: { rating: number }) {
        Router.push(`${bookId}/ratings/${rating}`);
    }

    function RenderTooltipContent({ payload }: any) {
        const data = payload?.[0]?.payload;
        if (!data) return <></>;

        return (
            <div className="flex items-center rounded-lg border border-black bg-primary/95 px-2 py-1 text-xs font-semibold">
                <span className="mr-1">{data.amount}</span>
                <RatingStars rating={data.rating} size={12} />
                <span className="ml-1">avaliações ({data.percentage}%)</span>
            </div>
        );
    }

    return (
        <div className="mt-3 flex flex-col justify-center rounded-lg border border-black px-4 pb-6 pt-4 text-sm">
            <div className="my-1 flex items-center justify-between">
                <h3 className="font-semibold">Avaliações</h3>
                <div className="flex items-center gap-1">
                    <Star size={14} weight="fill" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {bookRatings.averageRating.toFixed(2)} ({bookRatings.total})
                    </p>
                </div>
            </div>

            {bookRatings.total > 0 ? (
                <div className="flex items-end">
                    <div className="mb-[6px]">
                        <StarHalf size={14} weight="fill" />
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
                                        className="fill-zinc-400"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="mb-[6px] flex flex-col">
                        <Star size={14} weight="fill" />
                        <Star size={14} weight="fill" />
                        <Star size={14} weight="fill" />
                        <Star size={14} weight="fill" />
                        <Star size={14} weight="fill" />
                    </div>
                </div>
            ) : (
                <div className="mt-5 text-center">Nenhuma avaliação para esse livro.</div>
            )}
        </div>
    );
}