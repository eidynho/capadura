import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";

export interface UseRegisterUserProps {
    username: string;
    email: string;
    password: string;
}

export function useRegisterUser() {
    return useMutation({
        mutationFn: async ({ username, email, password }: UseRegisterUserProps) => {
            await api.post("/users", {
                username,
                email,
                password,
            });
        },
    });
}
