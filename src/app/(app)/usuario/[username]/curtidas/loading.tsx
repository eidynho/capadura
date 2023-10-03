"use client";

import { Container } from "@/components/layout/Container";

export default function Loading() {
    return (
        <Container className="animate-pulse">
            <div className="flex flex-col items-start justify-center">
                <div className="mb-2 h-8 w-48 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                <div className="h-6 w-56 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
            </div>

            <div className="mt-12 flex flex-col items-center justify-center overflow-hidden">
                {Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="flex items-center gap-8 py-4">
                        <div className="h-20 w-16 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>

                        <div className="flex w-full flex-1 items-center justify-between gap-8">
                            <div className="h-8 w-28 rounded-md bg-zinc-300 dark:bg-accent lg:w-48"></div>
                            <div className="h-8 w-20 rounded-md bg-zinc-300 dark:bg-accent lg:w-28"></div>
                            <div className="hidden h-8 w-20 rounded-md bg-zinc-300 dark:bg-accent md:block lg:w-28"></div>
                            <div className="hidden h-8 w-20 rounded-md bg-zinc-300 dark:bg-accent md:block lg:w-28"></div>
                            <div className="hidden h-8 w-20 rounded-md bg-zinc-300 dark:bg-accent md:block lg:w-28"></div>
                            <div className="hidden h-8 w-8 rounded-md bg-zinc-300 dark:bg-accent sm:block"></div>
                        </div>
                    </div>
                ))}
            </div>
        </Container>
    );
}
