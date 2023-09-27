import Link from "next/link";

import { Button } from "@/components/ui/Button";

export function Header() {
    return (
        <header className="mx-auto flex h-96 flex-col items-center justify-center">
            <div className="z-10 max-w-3xl lg:text-center">
                <div className="mb-4 inline-block rounded-md bg-yellow-200 px-1 text-base font-semibold leading-7 text-black">
                    Anunciando o lançamento da versão beta
                </div>
                <h1 className="text-3xl font-bold leading-9 tracking-tight text-black dark:text-white sm:text-4xl md:text-6xl">
                    A sua rede social de livros
                </h1>
                <p className="mt-6 break-words text-lg leading-8 text-muted-foreground">
                    Conecte-se com apaixonados por livros, descubra recomendações, compartilhe
                    leituras e explore um mundo literário colaborativo. Junte-se a nós!
                </p>
                <div className="mt-10 flex items-center gap-x-4 lg:justify-center">
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

            <div className="relative isolate w-1/2">
                <div
                    className="absolute inset-x-0 -top-[34rem] right-0 -z-10 transform-gpu overflow-hidden blur-3xl"
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
        </header>
    );
}
