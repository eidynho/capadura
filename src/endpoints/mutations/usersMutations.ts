import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { ProfileDataResponse } from "../queries/usersQueries";

import { useToast } from "@/components/ui/UseToast";

export interface UseRegisterUserProps {
    username: string;
    email: string;
    password: string;
}

export function useRegisterUser() {
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ username, email, password }: UseRegisterUserProps) => {
            await api.post("/users", {
                username,
                email,
                password,
            });
        },
        onError: () => {
            toast({
                title: "Ocorreu um erro no cadastro.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

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
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ email, password }: UseSignInProps) => {
            const { data } = await api.post("/sessions", {
                email,
                password,
            });

            return data as UseSignInResponse;
        },
        onError: () => {
            toast({
                title: "Ocorreu um erro ao entrar.",
                description: "O e-mail ou a senha estão incorretos.",
                variant: "destructive",
            });

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

    const { toast } = useToast();

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
            toast({
                title: "Erro ao atualizar perfil.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on update user data.");
        },
    });
}
