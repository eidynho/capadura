import Link from "next/link";
import { MoveLeft } from "lucide-react";

import { Button } from "@/components/ui/Button";

export default async function NotFound() {
    return (
        <div className="flex min-h-[84dvh] w-full justify-center text-black dark:text-white">
            <header className="flex items-center justify-center gap-4 text-center">
                <div className="flex flex-col gap-4">
                    <div>
                        <span className="inline-block rounded-md bg-red-200 px-1 text-base font-semibold leading-7 text-black">
                            404
                        </span>
                    </div>

                    <h1 className="mb-1 text-5xl font-bold leading-snug">Página não encontrada</h1>

                    <p className="mb-8 text-lg">
                        Lamentamos, mas não conseguimos encontrar a página que procura.
                    </p>

                    <Link href="/">
                        <Button size="md" variant="outline">
                            <MoveLeft size={16} />
                            Retornar ao início
                        </Button>
                    </Link>
                </div>
            </header>
        </div>
    );
}
