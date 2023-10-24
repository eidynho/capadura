"use client";

import { SVGProps, useState } from "react";
import { BarChart, Bar, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

import { useAuthContext } from "@/contexts/AuthContext";
import { useGetPagesReadedByDay } from "@/endpoints/queries/progressQueries";
import { useToast } from "@/components/ui/UseToast";

const CustomTooltipCursor = (props: SVGProps<SVGElement>) => {
    const { x, y, width, height } = props;
    return <rect fill="#e4e4e780" x={x} y={y} rx="4" width={width} height={height} />;
};

export function PagesReadedChart() {
    const [barGraphData, setBarGraphData] = useState({ x: 0, y: 0 });

    const { user } = useAuthContext();
    const { toast } = useToast();

    const { data: pagesReaded, isError: isErrorPagesReaded } = useGetPagesReadedByDay({
        userId: user?.id || "",
        enabled: !!user?.id,
    });

    if (isErrorPagesReaded) {
        toast({
            title: "Erro ao exibir suas páginas lidas nos últimos 30 dias.",
            variant: "destructive",
        });
        return;
    }

    if (!pagesReaded) return;

    const totalPagesReaded30Days = pagesReaded.reduce((cur, acc) => {
        return cur + acc.pagesReaded;
    }, 0);
    const averagePerDay = Math.floor(totalPagesReaded30Days / 30);

    function ChartTooltipContent({ payload }: any) {
        const data = payload?.[0]?.payload;
        if (!data) return <></>;

        return (
            <div className="flex items-center rounded-md border bg-white px-2 py-1 text-xs font-semibold text-black dark:bg-dark dark:text-white">
                {data.pagesReaded} páginas lidas em {data.createdAt}
            </div>
        );
    }

    function onMouseOverBar(data: any) {
        if (!data || !pagesReaded) return;

        const index = pagesReaded.findIndex((item) => item.createdAt === data.createdAt);

        const offSetPosition = () => {
            if (index > 15) {
                return -84;
            } else {
                return 100;
            }
        };

        setBarGraphData({
            x: data.x + offSetPosition(),
            y: data.y,
        });
    }

    return (
        <>
            <h2 className="mb-3 font-semibold text-black dark:text-white">
                Páginas lidas nos últimos 30 dias
            </h2>

            <div className="mb-8 flex flex-col justify-center rounded-md border bg-white px-4 pb-6 pt-4 text-sm transition-colors dark:bg-dark">
                <div className="my-1 flex items-center justify-between text-sm">
                    <div className="text-black dark:text-white">
                        <span className="mr-1">Total:</span>
                        <span className="font-medium">{totalPagesReaded30Days} páginas</span>
                    </div>

                    <div className="text-black dark:text-white">
                        <span className="text-black dark:text-white">
                            <span className="mr-1">Média por dia:</span>
                            <span className="font-medium">{averagePerDay}</span>
                        </span>
                    </div>
                </div>

                <div className="flex items-end">
                    <ResponsiveContainer width="100%" height={96}>
                        <BarChart data={pagesReaded}>
                            <RechartsTooltip
                                content={<ChartTooltipContent />}
                                cursor={<CustomTooltipCursor />}
                                position={{ x: barGraphData.x - 100, y: barGraphData.y - 30 }}
                                animationDuration={300}
                            />
                            <Bar
                                dataKey="pagesReaded"
                                minPointSize={2}
                                onMouseOver={onMouseOverBar}
                                radius={[4, 4, 0, 0]}
                            >
                                {pagesReaded.map((entry) => (
                                    <Cell key={entry.pagesReaded} className="fill-primary" />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
}
