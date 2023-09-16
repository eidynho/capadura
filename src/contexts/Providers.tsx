"use client";

import { ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

import { ThemeProvider } from "./ThemeContext";

import { AuthProvider } from "./AuthContext";

interface ProvidersProps {
    children: ReactNode;
}
export function Providers({ children }: ProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
