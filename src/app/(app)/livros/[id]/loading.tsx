import { Fragment } from "react";

import { Separator } from "@/components/ui/Separator";
import { Container } from "@/components/layout/Container";

function renderBookHeader() {
    return (
        <>
            <div className="h-9 w-64 rounded-md bg-zinc-300 dark:bg-accent"></div>
            <div className="my-2 h-6 w-56 rounded-md bg-zinc-300 dark:bg-accent"></div>
        </>
    );
}

export default function Loading() {
    return (
        <Container className="animate-pulse">
            <div className="mt-5 flex flex-col justify-center">
                <div className="flex flex-col">
                    <div className="flex flex-col items-start justify-center gap-8 md:flex-row">
                        <div className="w-full md:w-[19.5rem]">
                            {/* Book header */}
                            <div className="block md:hidden">{renderBookHeader()}</div>

                            {/* Book image */}
                            <div className="h-96 w-full rounded-md bg-zinc-300 dark:bg-accent md:w-[19.5rem]"></div>

                            {/* Book data */}
                            <div className="mt-3 rounded-md border border-zinc-300 pb-4 dark:border-accent">
                                <div className="mx-4 mt-4 flex justify-between text-sm">
                                    <div className="h-5 w-24 rounded-md bg-zinc-300 dark:bg-accent"></div>

                                    <div className="h-5 w-16 rounded-md bg-zinc-300 dark:bg-accent"></div>
                                </div>

                                <Separator className="my-4" />

                                <div className="mx-4 flex justify-between text-sm">
                                    <div className="h-5 w-32 rounded-md bg-zinc-300 dark:bg-accent"></div>

                                    <div className="w-16 rounded-md bg-zinc-300 dark:bg-accent"></div>
                                </div>

                                <Separator className="my-4" />

                                <div className="mx-4 flex justify-between text-sm">
                                    <div className="h-5 w-20 rounded-md bg-zinc-300 dark:bg-accent"></div>

                                    <div className="w-16 rounded-md bg-zinc-300 dark:bg-accent"></div>
                                </div>

                                <Separator className="my-4" />

                                <div className="mx-4 flex justify-between text-sm">
                                    <div className="h-5 w-16 rounded-md bg-zinc-300 dark:bg-accent"></div>

                                    <div className="w-16 rounded-md bg-zinc-300 dark:bg-accent"></div>
                                </div>

                                <Separator className="my-4" />

                                <div className="mx-4 flex justify-between text-sm">
                                    <div className="h-5 w-20 rounded-md bg-zinc-300 dark:bg-accent"></div>

                                    <div className="w-16 rounded-md bg-zinc-300 dark:bg-accent"></div>
                                </div>
                            </div>

                            {/* Community rating */}
                            <div className="mt-4 h-40 w-full items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                        </div>

                        <div className="flex w-full flex-col md:w-[calc(100%-344px)]">
                            {/* Book header */}
                            <div className="hidden md:block">{renderBookHeader()}</div>

                            <div className="flex w-full flex-col gap-8 xl:flex-row">
                                <div className="flex w-full flex-col gap-2">
                                    {/* Book content */}
                                    <div className="h-4 w-full items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                                    <div className="h-4 w-2/3 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>

                                    <div className="mt-2 h-4 w-full items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                                    <div className="h-4 w-full items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                                    <div className="h-4 w-full items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                                    <div className="h-4 w-1/3 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>

                                    <div className="mt-2 h-4 w-full items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                                    <div className="h-4 w-full items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                                    <div className="h-4 w-2/5 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>

                                    {/* Book action buttons */}
                                    <div className="mt-2 flex w-full items-center gap-2">
                                        <div className="h-9 w-24 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                                        <div className="h-9 w-40 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                                    </div>

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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
