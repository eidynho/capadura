"use client";

import { useContext } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { AuthContext } from "@/contexts/AuthContext";
import getGoogleOAuthURL from "@/utils/get-google-url";
import { FieldValues, useForm } from "react-hook-form";

export default function Login() {
    const { register, handleSubmit } = useForm();
    const { signIn } = useContext(AuthContext);

    function handleSignIn({ email, password }: FieldValues) {
        signIn({
            email,
            password,
        });
    }

    return (
        <div className="flex w-full">
            <main className="w-full px-4 lg:w-3/5 lg:px-20">
                <header className="pb-20 pt-20">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="font-medium">
                            Contopia
                        </Link>
                        <Link href="/cadastro" className="font-medium underline">
                            Criar conta
                        </Link>
                    </div>
                    <h1 className="mt-20 text-justify text-4xl font-medium leading-snug">
                        Bem-vindo(a) de volta.
                    </h1>
                </header>
                <div className="flex w-full flex-col gap-8">
                    <Button asChild size="md" variant="black">
                        <Link href={getGoogleOAuthURL()}>Conectar com Google</Link>
                    </Button>
                    <div
                        className="flex items-center
                            before:mr-4 before:h-[1px] before:flex-1 before:bg-black before:content-['']
                            after:ml-4 after:h-[1px] after:flex-1 after:bg-black after:content-['']
                        "
                    >
                        <span>ou</span>
                    </div>
                    <form onSubmit={handleSubmit(handleSignIn)} className="flex flex-col gap-8">
                        <label className="w-full">
                            <span className="mb-2 block font-medium">Email</span>
                            <input
                                {...register("email")}
                                type="text"
                                className="w-full rounded-md border border-black px-4 py-3 font-normal outline-pink-500"
                            />
                        </label>
                        <label className="w-full">
                            <div className="flex items-center justify-between">
                                <span className="mb-2 block font-medium">Senha</span>
                                <Link href="#" className="font-medium underline">
                                    Esqueci minha senha
                                </Link>
                            </div>
                            <input
                                {...register("password")}
                                type="password"
                                className="w-full rounded-md border border-black px-4 py-3 font-normal outline-pink-500"
                            />
                        </label>

                        <Button variant="black">Entrar</Button>
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
                <div className="h-screen w-full bg-black"></div>
            </aside>
        </div>
    );
}
