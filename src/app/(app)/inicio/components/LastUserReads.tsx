"use client";

import { useFetchManyFinishedReads } from "@/endpoints/queries/readsQueries";
import { SimpleRead } from "../../livros/[id]/components/Read/SimpleRead";

export function LastUsersReads() {
    const { data: lastUsersReads } = useFetchManyFinishedReads({});

    if (!lastUsersReads) return;

    const evenReads = lastUsersReads.items.filter((reads, index) => index % 2 === 0);
    const oddReads = lastUsersReads.items.filter((reads, index) => index % 2 !== 0);

    return (
        <>
            <h2 className="mb-3 font-semibold text-black dark:text-white">
                O que outros membros estão lendo
            </h2>

            <div className="mt-2 flex flex-col gap-2 lg:flex-row">
                <div className="flex flex-col gap-2 lg:w-1/2">
                    {evenReads.length &&
                        evenReads.map((read) => <SimpleRead read={read} hasBookImage />)}
                </div>

                <div className="flex flex-col gap-2 lg:w-1/2">
                    {oddReads.length &&
                        oddReads.map((read) => <SimpleRead read={read} hasBookImage />)}
                </div>
            </div>
        </>
    );
}
