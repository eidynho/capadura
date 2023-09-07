import { useContext } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { GoogleLogo } from "phosphor-react";

import { AuthContext } from "@/contexts/AuthContext";
import getGoogleOAuthURL from "@/utils/get-google-url";
import { LoginFormSchema } from "@/app/(app)/(auth)/entrar/page";

import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";

export function AuthDialog() {
    const { isOpenAuthDialog, toggleAuthDialog } = useContext(AuthContext);

    const { register, handleSubmit } = useForm<LoginFormSchema>();
    const { signIn, isSignInLoading } = useContext(AuthContext);

    function handleSignIn({ email, password }: LoginFormSchema) {
        signIn({
            email,
            password,
            onSuccess: () => {
                toggleAuthDialog(false);
            },
        });
    }

    return (
        <Dialog open={isOpenAuthDialog} onOpenChange={toggleAuthDialog}>
            <DialogContent>
                <div className="flex flex-col items-center justify-center gap-4 px-3 py-2">
                    <h1>Contopia</h1>

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
                                    <Link
                                        href="#"
                                        className="text-sm text-muted-foreground hover:underline"
                                    >
                                        Esqueci minha senha
                                    </Link>
                                </div>
                                <Input {...register("password")} type="password" />
                            </label>

                            <Button variant="primary" disabled={isSignInLoading}>
                                {isSignInLoading ? (
                                    <>
                                        <Loader2 size={22} className="animate-spin" />
                                        <span>Entrando...</span>
                                    </>
                                ) : (
                                    <span>Entrar</span>
                                )}
                            </Button>
                        </form>

                        <Separator />

                        <span className="text-center">
                            Não tem uma conta?
                            <Link
                                href="/criar-conta"
                                onClick={() => toggleAuthDialog(false)}
                                className="ml-1 font-semibold text-primary hover:underline"
                            >
                                Criar conta
                            </Link>
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
