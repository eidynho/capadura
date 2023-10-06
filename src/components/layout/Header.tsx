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
        </header>
    );
}
