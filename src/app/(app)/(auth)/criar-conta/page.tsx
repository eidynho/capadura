"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Eye, EyeOff, Loader2, XCircle } from "lucide-react";
import { GoogleLogo } from "phosphor-react";

import { api } from "@/lib/api";
import { useAuthContext } from "@/contexts/AuthContext";
import getGoogleOAuthURL from "@/utils/get-google-url";
import { ProfileDataResponse } from "@/endpoints/queries/usersQueries";

import { useRegisterUser } from "@/endpoints/mutations/usersMutations";
import { useToast } from "@/components/ui/UseToast";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

const signUpFormSchema = z.object({
    username: z
        .string()
        .min(1, { message: "Campo obrigatório." })
        .max(50, { message: "Máximo 50 caracteres." }),
    email: z
        .string()
        .min(1, { message: "Campo obrigatório" })
        .max(200, { message: "Máximo 200 caracteres." })
        .email({ message: "E-mail inválido." }),
    password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
});

type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

export default function SignUp() {
    const { signIn } = useAuthContext();
    const { toast } = useToast();

    const [showPassword, setShowPassword] = useState(false);
    const [isValidatingUsername, setIsValidatingUsername] = useState(false);
    const [containsInvalidChars, setContainsInvalidChars] = useState(false);
    const [usernameAlreadyExists, setUsernameAlreadyExists] = useState(false);

    const {
        formState: { isSubmitting, errors },
        register,
        handleSubmit,
        watch,
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(signUpFormSchema),
    });

    const typedUsername = watch("username");

    const registerUser = useRegisterUser();
    function handleSignUp({ username, email, password }: SignUpFormSchema) {
        if (isInvalidUsername) return;

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

    async function verifyUsername() {
        if (!typedUsername) return;

        setIsValidatingUsername(true);

        // letters, numbers, dot and underscore
        const validCharactersRgx = /^[a-zA-Z0-9._]+$/;

        if (!validCharactersRgx.test(typedUsername)) {
            setContainsInvalidChars(true);
            setIsValidatingUsername(false);
            return;
        }
        setContainsInvalidChars(false);

        try {
            const { data } = await api.get<ProfileDataResponse>(`users/${typedUsername.trim()}`);
            const existsUsername = !!data.username;

            setUsernameAlreadyExists(existsUsername);
        } catch {
            toast({
                title: "Falha ao verificar se o usuário já existe.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on verify user username.");
        } finally {
            setIsValidatingUsername(false);
        }
    }

    const isInvalidUsername = containsInvalidChars || usernameAlreadyExists || !!errors.username;

    return (
        <div className="mt-20 flex min-h-[84dvh] w-full items-center justify-center text-black dark:text-white">
            <div className="mx-4 w-full sm:mx-0 sm:max-w-sm">
                <div className="text-center">
                    <span className="font-medium">Capadura</span>
                </div>
                <h1 className="mt-6 text-center text-xl font-bold leading-9 tracking-tight">
                    Bem-vindo a Capadura
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

                    <form onSubmit={handleSubmit(handleSignUp)} className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="sign-up-username">Nome do usuário</Label>
                            <div className="relative mt-2 w-full">
                                <Input
                                    {...register("username")}
                                    id="sign-up-username"
                                    type="text"
                                    maxLength={50}
                                    className={`${
                                        isInvalidUsername ? "border-destructive" : ""
                                    } w-full pr-9`}
                                    onBlur={verifyUsername}
                                />
                                {!!typedUsername && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {isValidatingUsername ? (
                                            <Loader2
                                                size={16}
                                                className="animate-spin text-muted-foreground"
                                            />
                                        ) : isInvalidUsername ? (
                                            <XCircle size={16} className="text-destructive" />
                                        ) : (
                                            <CheckCircle2 size={16} className="text-green-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {isInvalidUsername && (
                                <span className="mt-1 text-xs font-medium text-destructive">
                                    {!typedUsername
                                        ? "Campo obrigatório."
                                        : containsInvalidChars
                                        ? "Contém caracteres inválidos."
                                        : usernameAlreadyExists
                                        ? "O nome de usuário já existe."
                                        : errors.username
                                        ? errors.username.message
                                        : ""}
                                </span>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="sign-up-email">
                                Email
                                <Input
                                    {...register("email")}
                                    id="sign-up-email"
                                    type="text"
                                    className={`${errors.email ? "border-destructive" : ""} mt-2`}
                                />
                                {errors.email && (
                                    <span className="mt-1 text-xs font-medium text-destructive">
                                        {errors.email.message}
                                    </span>
                                )}
                            </Label>
                        </div>

                        <div>
                            <Label htmlFor="sign-up-password">Senha</Label>
                            <div className="relative">
                                <Input
                                    {...register("password")}
                                    id="sign-up-password"
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

                        <Button
                            size="sm"
                            variant="primary"
                            disabled={isSubmitting || isInvalidUsername}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={22} className="animate-spin" />
                                    <span>Criando conta...</span>
                                </>
                            ) : (
                                <span>Criar conta</span>
                            )}
                        </Button>
                    </form>
                    <span className="block text-muted-foreground">
                        Você concorda com nossos{" "}
                        <Link href="" className="text-yellow-700 hover:underline dark:text-primary">
                            Termos de Uso
                        </Link>{" "}
                        e{" "}
                        <Link href="" className="text-yellow-700 hover:underline dark:text-primary">
                            Política de Privacidade
                        </Link>
                        .
                    </span>
                </div>
            </div>
        </div>
    );
}
