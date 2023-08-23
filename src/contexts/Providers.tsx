"use client";

import { ReactNode } from "react";

import { AuthProvider } from "./AuthContext";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface ProvidersProps {
    children: ReactNode;
}
export function Providers({ children }: ProvidersProps) {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </AuthProvider>
    );
}
