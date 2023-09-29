"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleLogo } from "phosphor-react";

import { useAuthContext } from "@/contexts/AuthContext";
import getGoogleOAuthURL from "@/utils/get-google-url";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

const loginFormSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Campo obrigatório" })
        .max(200, { message: "Máximo 200 caracteres." })
        .email({ message: "E-mail inválido." }),
    password: z.string().min(1, { message: "Campo obrigatório" }),
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

export default function Login() {
    const { signIn, isSignInLoading } = useAuthContext();

    const [showPassword, setShowPassword] = useState(false);

    const {
        formState: { errors },
        register,
        handleSubmit,
    } = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
    });

    function handleSignIn({ email, password }: LoginFormSchema) {
        signIn({
            email,
            password,
        });
    }

    return (
        <div className="mt-20 flex min-h-[80dvh] w-full items-center justify-center text-black dark:text-white">
            <div className="mx-4 w-full sm:mx-0 sm:max-w-sm">
                <div className="text-center">
                    <span className="font-medium">Capadura</span>
                </div>
                <h1 className="mt-6 text-center text-xl font-bold leading-9 tracking-tight">
                    Bem-vindo de volta
                </h1>
                <div className="mt-12 flex w-full flex-col gap-4">
                    <Button asChild size="sm" variant="outline">
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

                    <form onSubmit={handleSubmit(handleSignIn)} className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="sign-in-email">Email</Label>
                            <Input
                                {...register("email")}
                                id="sign-in-email"
                                type="text"
                                className={`${errors.email ? "border-destructive" : ""} mt-2`}
                            />
                            {errors.email && (
                                <span className="mt-1 text-xs font-medium text-destructive">
                                    {errors.email.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="sign-in-password">Senha</Label>
                            <div className="relative">
                                <Input
                                    {...register("password")}
                                    id="sign-in-password"
                                    type={showPassword ? "text" : "password"}
                                    className={`${
                                        errors.password ? "border-destructive" : ""
                                    } mt-2`}
                                />
                                <Button
                                    size="icon"
                                    variant="default"
                                    type="button"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </Button>
                            </div>
                            {errors.password && (
                                <span className="mt-1 text-xs font-medium text-destructive">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        <Button size="sm" variant="primary" disabled={isSignInLoading}>
                            {isSignInLoading ? (
                                <>
                                    <Loader2 size={22} className="animate-spin" />
                                    <span>Entrando...</span>
                                </>
                            ) : (
                                <span>Entrar</span>
                            )}
                        </Button>

                        <div className="text-center">
                            <span className="mr-1">Não é um membro ainda?</span>
                            <Link
                                href="/criar-conta"
                                className="text-yellow-700 hover:underline dark:text-primary"
                            >
                                Comece agora, é grátis.
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
