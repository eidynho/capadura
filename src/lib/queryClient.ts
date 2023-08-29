import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 60 * 1, // 1 hour
            retry: 1,
            retryDelay: 2000,
        },
    },
});
