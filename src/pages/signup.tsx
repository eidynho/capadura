import { useContext } from "react";
import Router from "next/router";
import Link from "next/link";
import { FieldValues, useForm } from "react-hook-form";

import { api } from "@/lib/api";
import { AuthContext } from "@/contexts/AuthContext";
import getGoogleOAuthURL from "@/utils/get-google-url";

import { Button } from "@/components/Button";
import { ButtonLink } from "@/components/ButtonLink";

export default function SignUp() {
    const { register, handleSubmit } = useForm();
    const { signIn } = useContext(AuthContext);

    async function handleSignUp({ name, email, password }: FieldValues) {
        try {
            await api.post("/users", {
                name,
                email,
                password,
            });

            await signIn({
                email,
                password,
            });

            Router.push("/app/transcribe");
        } catch (err) {
            throw new Error("Failed to create account: " + err);
        }
    }

    return (
        <div className="w-full flex">
            <main className="w-full px-4 lg:px-20 lg:w-3/5">
                <header className="pt-20 pb-20">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="font-medium">
                            Contopia
                        </Link>
                        <Link href="/login" className="font-medium underline">
                            Entrar
                        </Link>
                    </div>
                    <h1 className="mt-20 text-4xl leading-snug font-medium text-justify">
                        Faça parte de uma comunidade que ama livros.
                    </h1>
                </header>
                <div className="w-full flex flex-col gap-8">
                    <ButtonLink href={getGoogleOAuthURL()} size="md" className="bg-blue-500">
                        Conectar com Google
                    </ButtonLink>
                    <div
                        className="flex items-center
                            before:content-[''] before:flex-1 before:h-[1px] before:bg-black before:mr-4
                            after:content-[''] after:flex-1 after:h-[1px] after:bg-black after:ml-4
                        "
                    >
                        <span>ou</span>
                    </div>
                    <form onSubmit={handleSubmit(handleSignUp)} className="flex flex-col gap-8">
                        <label className="w-full">
                            <span className="block mb-2 font-medium">Nome</span>
                            <input
                                {...register("name")}
                                type="text"
                                className="w-full px-4 py-3 border border-black outline-pink-500 font-normal rounded-md"
                            />
                        </label>
                        <label className="w-full">
                            <span className="block mb-2 font-medium">Email</span>
                            <input
                                {...register("email")}
                                type="text"
                                className="w-full px-4 py-3 border border-black outline-pink-500 font-normal rounded-md"
                            />
                        </label>
                        <label className="w-full">
                            <span className="block mb-2 font-medium">Senha</span>
                            <input
                                {...register("password")}
                                type="password"
                                className="w-full px-4 py-3 border border-black outline-pink-500 font-normal rounded-md"
                            />
                        </label>
                        <Button size="md">Criar conta</Button>
                    </form>
                    <span className="block font-medium mb-8">
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
            <aside className="hidden lg:w-2/5 lg:block">
                <div className="w-full h-screen bg-black"></div>
            </aside>
        </div>
    );
}
