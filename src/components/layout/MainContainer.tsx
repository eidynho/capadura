"use client";

import { ReactNode } from "react";

import { AppNavBar } from "../AppNavBar";

interface MainContinerProps {
    children: ReactNode;
}

export function MainContainer({ children }: MainContinerProps) {
    return (
        <main className="ml-auto min-h-[100dvh] w-full bg-light transition-colors dark:bg-dark lg:w-full">
            {children}
            <AppNavBar />
        </main>
    );
}
