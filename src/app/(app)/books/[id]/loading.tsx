import { Fragment } from "react";

import { Separator } from "@/components/Separator";
import { Container } from "@/components/layout/Container";

function renderBookHeader() {
    return (
        <>
            <div className="h-9 w-64 rounded-md bg-gray-200"></div>
            <div className="my-2 h-6 w-56 rounded-md bg-gray-200"></div>
        </>
    );
}

export default function Loading() {
    return (
        <Container>
            <div className="mt-5 flex animate-pulse flex-col justify-center">
                <div className="flex flex-col">
                    <div className="flex flex-col items-start justify-center gap-8 md:flex-row">
                        <div className="w-full md:w-[19.5rem]">
                            {/* Book header */}
                            <div className="block md:hidden">{renderBookHeader()}</div>

                            {/* Book image */}
                            <div className="h-96 w-full rounded-lg bg-gray-200 md:w-[19.5rem]"></div>

                            {/* Book data */}
                            <div className="mt-3 rounded-lg border border-gray-200 pb-4">
                                <div className="mx-4 mt-4 flex justify-between text-sm">
                                    <div className="h-5 w-24 rounded-md bg-gray-200"></div>

                                    <div className="h-5 w-16 rounded-md bg-gray-200"></div>
                                </div>

                                <Separator className="border-gray-200" />

                                <div className="mx-4 flex justify-between text-sm">
                                    <div className="h-5 w-32 rounded-md bg-gray-200"></div>

                                    <div className="w-16 rounded-md bg-gray-200"></div>
                                </div>

                                <Separator className="border-gray-200" />

                                <div className="mx-4 flex justify-between text-sm">
                                    <div className="h-5 w-20 rounded-md bg-gray-200"></div>

                                    <div className="w-16 rounded-md bg-gray-200"></div>
                                </div>

                                <Separator className="border-gray-200" />

                                <div className="mx-4 flex justify-between text-sm">
                                    <div className="h-5 w-16 rounded-md bg-gray-200"></div>

                                    <div className="w-16 rounded-md bg-gray-200"></div>
                                </div>

                                <Separator className="border-gray-200" />

                                <div className="mx-4 flex justify-between text-sm">
                                    <div className="h-5 w-20 rounded-md bg-gray-200"></div>

                                    <div className="w-16 rounded-md bg-gray-200"></div>
                                </div>
                            </div>

                            {/* Community rating */}
                            <div className="mt-4 h-40 w-full items-center rounded-lg bg-gray-200"></div>
                        </div>

                        <div className="flex w-full flex-col md:w-[calc(100%-344px)]">
                            {/* Book header */}
                            <div className="hidden md:block">{renderBookHeader()}</div>

                            <div className="flex w-full flex-col gap-8 xl:flex-row">
                                <div className="flex w-full flex-col gap-2">
                                    {/* Book content */}
                                    <div className="h-4 w-full items-center rounded-lg bg-gray-200"></div>
                                    <div className="h-4 w-2/3 items-center rounded-lg bg-gray-200"></div>

                                    <div className="mt-2 h-4 w-full items-center rounded-lg bg-gray-200"></div>
                                    <div className="h-4 w-full items-center rounded-lg bg-gray-200"></div>
                                    <div className="h-4 w-full items-center rounded-lg bg-gray-200"></div>
                                    <div className="h-4 w-1/3 items-center rounded-lg bg-gray-200"></div>

                                    <div className="mt-2 h-4 w-full items-center rounded-lg bg-gray-200"></div>
                                    <div className="h-4 w-full items-center rounded-lg bg-gray-200"></div>
                                    <div className="h-4 w-2/5 items-center rounded-lg bg-gray-200"></div>

                                    {/* Book action buttons */}
                                    <div className="mt-2 flex w-full items-center gap-2">
                                        <div className="h-9 w-24 items-center rounded-lg bg-gray-200"></div>
                                        <div className="h-9 w-40 items-center rounded-lg bg-gray-200"></div>
                                    </div>

                                    {/* Book tabs */}
                                    <div className="mt-4 w-full items-center rounded-lg border border-gray-200 p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 items-center rounded-full bg-gray-200"></div>
                                                <div className="h-6 w-40 items-center rounded-lg bg-gray-200"></div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-24 items-center rounded-lg bg-gray-200"></div>
                                                <div className="h-6 w-20 items-center rounded-lg bg-gray-200"></div>
                                            </div>
                                        </div>

                                        <div className="mt-2 h-4 w-48 items-center rounded-lg bg-gray-200"></div>

                                        <div className="mt-6 h-5 w-40 items-center rounded-lg bg-gray-200"></div>

                                        {Array.from({ length: 3 }, (_, index) => (
                                            <Fragment key={index}>
                                                <Separator className="border-gray-200" />

                                                <div className="flex flex-col px-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-8 w-8 items-center rounded-full bg-gray-200"></div>
                                                            <div className="h-6 w-40 items-center rounded-lg bg-gray-200"></div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <div className="h-6 w-6 items-center rounded-lg bg-gray-200"></div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-6 h-4 w-2/3 items-center rounded-lg bg-gray-200"></div>
                                                    <div className="mt-4 h-6 w-full items-center rounded-lg bg-gray-200"></div>
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
