"use client";

import { useContext } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GoogleLogo } from "phosphor-react";

import { AuthContext } from "@/contexts/AuthContext";
import getGoogleOAuthURL from "@/utils/get-google-url";

import { useRegisterUser } from "@/endpoints/mutations/usersMutations";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const signUpFormSchema = z.object({
    username: z
        .string()
        .min(1, { message: "Campo obrigatório." })
        .max(50, { message: "Máximo 50 caracteres." }),
    email: z
        .string()
        .max(200, { message: "Máximo 200 caracteres." })
        .email({ message: "E-mail inválido" }),
    password: z.string(),
});

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

export default function SignUp() {
    const { register, handleSubmit } = useForm<SignUpFormSchema>();
    const { signIn } = useContext(AuthContext);

    const registerUser = useRegisterUser();
    function handleSignUp({ username, email, password }: SignUpFormSchema) {
        registerUser.mutate(
            {
                username,
                email,
                password,
            },
            {
                onSuccess: () => {
                    signIn({
                        email,
                        password,
                    });
                },
            },
        );
    }

    return (
        <div className="flex w-full text-black dark:text-white">
            <main className="w-full px-4 lg:w-3/5 lg:px-20">
                <header className="pb-20 pt-20">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="font-medium">
                            Capadura
                        </Link>
                        <Link href="/entrar" className="font-medium underline">
                            Entrar
                        </Link>
                    </div>
                    <h1 className="mt-20 text-justify text-4xl font-medium leading-snug">
                        Faça parte de uma comunidade que ama livros.
                    </h1>
                </header>
                <div className="flex w-full flex-col gap-8">
                    <Button asChild size="md" variant="outline">
                        <Link href={getGoogleOAuthURL()}>
                            <GoogleLogo size={18} weight="bold" />
                            Conectar com Google
                        </Link>
                    </Button>

                    <div
                        className="flex items-center transition-colors
                            before:mr-4 before:h-[1px] before:flex-1 before:bg-border before:content-['']
                            after:ml-4 after:h-[1px] after:flex-1 after:bg-border after:content-['']
                        "
                    >
                        <span className="text-muted-foreground">ou</span>
                    </div>

                    <form onSubmit={handleSubmit(handleSignUp)} className="flex flex-col gap-8">
                        <label className="w-full">
                            <span className="mb-2 block font-medium">Nome do usuário</span>
                            <Input {...register("username")} type="text" />
                        </label>
                        <label className="w-full">
                            <span className="mb-2 block font-medium">Email</span>
                            <Input {...register("email")} type="text" />
                        </label>
                        <label className="w-full">
                            <span className="mb-2 block font-medium">Senha</span>
                            <Input {...register("password")} type="password" />
                        </label>
                        <Button size="md" variant="primary">
                            Criar conta
                        </Button>
                    </form>
                    <span className="mb-8 block font-medium">
                        Você concorda com nossos{" "}
                        <Link href="" className="underline">
                            Termos de Uso
                        </Link>{" "}
                        e{" "}
                        <Link href="" className="underline">
                            Política de Privacidade
                        </Link>
                        .
                    </span>
                </div>
            </main>
            <aside className="hidden lg:block lg:w-2/5">
                <div className="h-screen w-full bg-dark"></div>
            </aside>
        </div>
    );
}
