import Link from "next/link";

import { Button } from "@/components/ui/Button";

const CircleEffect = () => (
    <svg
        viewBox="0 0 1024 1024"
        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:top-1/3 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
        aria-hidden="true"
    >
        <circle
            cx={512}
            cy={512}
            r={512}
            fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
            fillOpacity="0.7"
        />
        <defs>
            <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#FACC12" />
                <stop offset={1} stopColor="#d97706" />
            </radialGradient>
        </defs>
    </svg>
);

export function CTASection() {
    return (
        <div className="mx-auto max-w-7xl bg-light py-12 transition-colors dark:bg-dark lg:px-8 lg:py-16">
            <div className="relative isolate overflow-hidden rounded-2xl bg-black px-6 pb-16 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 lg:flex lg:gap-x-20 lg:px-20 lg:pb-0 lg:pt-0">
                <CircleEffect />
                <div className="mx-auto max-w-lg lg:flex-auto lg:py-32 lg:text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                        Dê um boost nas suas leituras.
                        <br />
                        Comece a usar hoje mesmo.
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        Aproveite sua leitura ao máximo! Meça seu progresso, compartilhe com amigos
                        e fique por dentro das últimas tendências. Comece agora mesmo!
                    </p>
                    <div className="mt-10 flex items-center gap-x-2 sm:gap-x-4 lg:justify-center">
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
        </div>
    );
}
