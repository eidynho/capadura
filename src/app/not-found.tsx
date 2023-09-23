import Link from "next/link";
import { MoveLeft } from "lucide-react";

import { Button } from "@/components/ui/Button";

export default async function NotFound() {
    return (
        <div className="flex h-[100dvh] w-full text-black dark:text-white">
            <main className="h-full w-full px-4 lg:w-1/2 lg:px-20">
                <header className="flex h-full flex-col justify-between pb-20 pt-20">
                    <Link href="/" className="font-medium">
                        Capadura
                    </Link>
                    <div className="flex flex-col gap-4">
                        <div>
                            <span className="inline-block rounded-md bg-red-200 px-1 text-base font-semibold leading-7 text-black">
                                404
                            </span>
                        </div>

                        <h1 className="mb-1 text-5xl font-bold leading-snug">
                            Página não encontrada
                        </h1>

                        <p className="mb-12 text-lg">
                            Lamentamos, mas não conseguimos encontrar a página que procura.
                        </p>

                        <Link href="/">
                            <Button size="md" variant="outline">
                                <MoveLeft size={16} />
                                Retornar ao início
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center gap-8 font-medium">
                        <Link href="#">Contatar suporte</Link>
                        <Link href="#">Instagram</Link>
                        <Link href="#">Twitter</Link>
                    </div>
                </header>
            </main>
            <aside className="hidden lg:block lg:w-1/2">
                <div className="h-full w-full bg-dark"></div>
            </aside>
        </div>
    );
}
