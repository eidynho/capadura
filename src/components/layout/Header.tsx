"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";

export function Header() {
    return (
        <header className="mx-auto flex min-h-[100dvh] w-full max-w-[100rem] items-center justify-center">
            <div className="ml-8 w-1/2 max-w-3xl">
                <div className="mb-8 flex">
                    <div className="rounded-full px-4 py-2 text-sm leading-6 text-muted-foreground ring-1 ring-border/50 hover:ring-border">
                        Anunciando o lançamento da versão beta
                    </div>
                </div>
                <div>
                    <span className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
                        Sua rede social de livros
                    </span>
                    <h1 className="mt-6 text-lg leading-8 text-muted-foreground">
                        Conecte-se com apaixonados por livros, descubra recomendações, compartilhe
                        leituras e explore um mundo literário colaborativo. Junte-se a nós!
                    </h1>
                    <div className="mt-10 flex items-center gap-x-6">
                        <Button asChild size="md" variant="primary">
                            <Link href="/criar-conta">Começar agora</Link>
                        </Button>
                        <Button asChild size="md" variant="outline">
                            <Link href="/entrar">
                                Fazer login <span aria-hidden="true">→</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mr-8 w-1/2">
                <div className="relative isolate">
                    <div
                        className="absolute inset-x-0 -right-16 -top-[34rem] -z-10 transform-gpu overflow-hidden blur-3xl"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#f7ec92] to-[#eeb702] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                            }}
                        />
                    </div>

                    <div
                        className="absolute inset-x-0 -top-96 right-8 -z-10 transform-gpu overflow-hidden blur-3xl"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#d6c755] to-[#e69d00] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                            }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
