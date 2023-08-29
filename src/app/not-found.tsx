import Link from "next/link";
import { Frown, MoveLeft } from "lucide-react";

import { Button } from "@/components/ui/Button";

export default async function NotFound() {
    return (
        <div className="flex h-[calc(100vh-76px)] flex-col items-center justify-center gap-8 overflow-hidden">
            <div className="rounded-full bg-zinc-200/40 p-6">
                <Frown size={48} />
            </div>
            <div className="flex flex-col items-center justify-center gap-4 text-center">
                <h1 className="text-xl font-semibold">Oops.</h1>
                <p className="mt-2 w-[26rem] text-sm leading-6 text-slate-600">
                    A página que você está tentando abrir não existe mais.
                </p>

                <div>
                    <Link href="/">
                        <Button size="md" variant="outline" className="group">
                            <MoveLeft size={16} className="transition-all group-hover:mr-1" />
                            Retornar ao início
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
