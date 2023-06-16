import { useContext } from "react";
import Link from "next/link";

import { Button } from "@/components/Button";
import { ButtonLink } from "@/components/ButtonLink";
import { AuthContext } from "@/contexts/AuthContext";
import getGoogleOAuthURL from "@/utils/get-google-url";
import { FieldValues, useForm } from "react-hook-form";

export default function Login() {
    const { register, handleSubmit } = useForm();
    const { signIn } = useContext(AuthContext);

    async function handleSignIn({ email, password }: FieldValues) {
        await signIn({
            email,
            password,
        });
    }

    return (
        <div className="w-full flex">
            <main className="w-full px-4 lg:px-20 lg:w-3/5">
                <header className="pt-20 pb-20">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="font-medium">
                            Contopia
                        </Link>
                        <Link href="/signup" className="font-medium underline">
                            Criar conta
                        </Link>
                    </div>
                    <h1 className="mt-20 text-4xl leading-snug font-medium text-justify">
                        Bem-vindo(a) de volta.
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
                    <form onSubmit={handleSubmit(handleSignIn)} className="flex flex-col gap-8">
                        <label className="w-full">
                            <span className="block mb-2 font-medium">Email</span>
                            <input
                                {...register("email")}
                                type="text"
                                className="w-full px-4 py-3 border border-black outline-pink-500 font-normal rounded-md"
                            />
                        </label>
                        <label className="w-full">
                            <div className="flex items-center justify-between">
                                <span className="block mb-2 font-medium">Senha</span>
                                <Link href="#" className="font-medium underline">
                                    Esqueci minha senha
                                </Link>
                            </div>
                            <input
                                {...register("password")}
                                type="password"
                                className="w-full px-4 py-3 border border-black outline-pink-500 font-normal rounded-md"
                            />
                        </label>

                        <Button size="md">Entrar</Button>
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
