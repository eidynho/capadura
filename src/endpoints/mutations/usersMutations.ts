import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { api } from "@/lib/api";
import { ProfileDataResponse } from "../queries/usersQueries";

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
        onError: () => {
            toast.error("Ocorreu um erro no cadastro.");
            throw new Error("Failed on register user.");
        },
    });
}

interface UseSignInResponse {
    token: string;
    refreshToken: string;
    user: ProfileDataResponse;
}

export interface UseSignInProps {
    email: string;
    password: string;
}

export function useSignIn() {
    return useMutation({
        mutationFn: async ({ email, password }: UseSignInProps) => {
            const { data } = await api.post("/sessions", {
                email,
                password,
            });

            return data as UseSignInResponse;
        },
        onError: () => {
            toast.error("Ocorreu um erro ao entrar.");
            throw new Error("Failed on sign in.");
        },
    });
}

export interface UseUpdateUserDataProps {
    id: string;
    name: string;
    username: string;
    email: string;
    image: any;
    description?: string;
    location?: string;
    website?: string;
    twitter?: string;
}

export function useUpdateUserData() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            name,
            username,
            email,
            image,
            description,
            location,
            website,
            twitter,
        }: UseUpdateUserDataProps) => {
            const { data } = await api.putForm("/me", {
                id,
                name,
                username,
                email,
                image,
                description,
                location,
                website,
                twitter,
            });

            return data as ProfileDataResponse;
        },
        onSuccess: (newData, { username }) => {
            queryClient.setQueryData<ProfileDataResponse>(
                ["fetchUserByUsername", { username }],
                () => newData,
            );
        },
        onError: () => {
            toast.error("Erro ao atualizar perfil.");
            throw new Error("Failed on update user data.");
        },
    });
}
