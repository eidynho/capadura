import { Fragment } from "react";

import { Separator } from "@/components/ui/Separator";

export default async function Loading() {
    return (
        <>
            {/* Book tabs */}
            <div className="mt-4 w-full items-center rounded-md border border-zinc-300 p-6 dark:border-accent">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 items-center rounded-full bg-zinc-300 dark:bg-accent"></div>
                        <div className="h-6 w-40 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="h-6 w-24 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                        <div className="h-6 w-20 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                    </div>
                </div>

                <div className="mt-2 h-4 w-48 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>

                <div className="mt-6 h-5 w-40 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>

                {Array.from({ length: 3 }, (_, index) => (
                    <Fragment key={index}>
                        <Separator className="my-4" />

                        <div className="flex flex-col px-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 items-center rounded-full bg-zinc-300 dark:bg-accent"></div>
                                    <div className="h-6 w-40 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                                </div>
                            </div>
                            <div className="mt-6 h-4 w-2/3 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                            <div className="mt-4 h-6 w-full items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                        </div>
                    </Fragment>
                ))}
            </div>
        </>
    );
}
