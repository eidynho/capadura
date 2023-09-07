"use client";

import { useContext } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { GoogleLogo } from "phosphor-react";

import { AuthContext } from "@/contexts/AuthContext";
import getGoogleOAuthURL from "@/utils/get-google-url";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { z } from "zod";

export const loginFormSchema = z.object({
    email: z
        .string()
        .max(200, { message: "Máximo 200 caracteres." })
        .email({ message: "E-mail inválido" }),
    password: z.string(),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

export default function Login() {
    const { register, handleSubmit } = useForm<LoginFormSchema>();
    const { signIn } = useContext(AuthContext);

    function handleSignIn({ email, password }: LoginFormSchema) {
        signIn({
            email,
            password,
        });
    }

    return (
        <div className="flex w-full text-black dark:text-white">
            <main className="w-full px-4 lg:w-3/5 lg:px-20">
                <header className="pb-20 pt-20">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="font-medium">
                            Contopia
                        </Link>
                        <Link href="/criar-conta" className="font-medium underline">
                            Criar conta
                        </Link>
                    </div>
                    <h1 className="mt-20 text-justify text-4xl font-medium leading-snug">
                        Bem-vindo(a) de volta.
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

                    <form onSubmit={handleSubmit(handleSignIn)} className="flex flex-col gap-8">
                        <label className="w-full">
                            <span className="mb-2 block font-medium">Email</span>
                            <Input {...register("email")} type="text" />
                        </label>
                        <label className="w-full">
                            <div className="flex items-center justify-between">
                                <span className="mb-2 block font-medium">Senha</span>
                                <Link href="#" className="font-medium underline">
                                    Esqueci minha senha
                                </Link>
                            </div>
                            <Input {...register("password")} type="password" />
                        </label>

                        <Button variant="primary">Entrar</Button>
                    </form>
                </div>
            </main>
            <aside className="hidden lg:block lg:w-2/5">
                <div className="h-screen w-full bg-dark"></div>
            </aside>
        </div>
    );
}
