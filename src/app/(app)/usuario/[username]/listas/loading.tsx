export default async function Loading() {
    return (
        <>
            <div className="flex animate-pulse flex-col items-start justify-center md:flex-row">
                <div className="flex items-start gap-8">
                    <div className="flex h-28 w-28 items-center gap-4 rounded-full bg-zinc-300 dark:bg-accent"></div>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start">
                            <div>
                                <div className="mb-2 h-6 w-48 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                                <div className="h-5 w-32 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                            </div>
                            <div className="h-9 w-24 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex animate-pulse flex-col justify-center gap-12 lg:flex-row">
                <div className="flex w-full flex-col gap-12 lg:w-3/5">
                    <div className="flex flex-col">
                        <div className="mb-1 h-6 w-32 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>

                        <div className="flex items-center justify-between gap-3">
                            {Array.from({ length: 4 }, (_, index) => (
                                <div
                                    key={index}
                                    className="h-64 w-44 items-center rounded-md bg-zinc-300 dark:bg-accent"
                                ></div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="mb-1 h-6 w-40 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>

                        {Array.from({ length: 3 }, (_, index) => (
                            <div
                                key={index}
                                className="flex gap-4 border-t border-dark/20 py-4 last:border-b"
                            >
                                <div className="h-28 w-20 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                                <div className="w-full">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="mb-1 h-6 w-44 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="h-5 w-32 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                                    </div>

                                    <div className="mt-3 h-4 w-2/3 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col">
                        <div className="mb-1 h-6 w-40 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>

                        {Array.from({ length: 3 }, (_, index) => (
                            <div
                                key={index}
                                className="flex gap-4 border-t border-dark/20 py-4 last:border-b"
                            >
                                <div className="h-28 w-20 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>

                                <div className="w-full">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="mb-1 flex items-center gap-2">
                                            <div className="h-6 w-44 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>

                                            <div className="h-4 w-20 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                                        </div>
                                    </div>

                                    <div className="mt-3 h-4 w-2/3 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>

                                    <div className="mt-4 h-7 w-full items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex w-full flex-col gap-4 sm:flex-row lg:w-72 lg:flex-col">
                    <div className="w-full sm:w-1/2 lg:w-full">
                        <div className="mb-1 h-6 w-24 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>

                        <div className="h-64 w-full items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                    </div>

                    <div className="w-full sm:w-1/2 lg:w-full">
                        <div className="mb-1 h-6 w-24 items-center rounded-md bg-zinc-300 dark:bg-accent"></div>

                        <div className="h-40 w-full items-center rounded-md bg-zinc-300 dark:bg-accent"></div>
                    </div>
                </div>
            </div>
        </>
    );
}
