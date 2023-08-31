"use client";

import { ReactNode } from "react";

interface MainContinerProps {
    children: ReactNode;
}

export function MainContainer({ children }: MainContinerProps) {
    return (
        <main className="ml-auto w-full bg-light transition-colors dark:bg-dark lg:w-full">
            {children}
        </main>
    );
}
