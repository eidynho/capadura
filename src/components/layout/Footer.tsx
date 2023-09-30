import { Separator } from "@/components/ui/Separator";

import { Instagram } from "@/components/svg/Instagram";
import { X } from "@/components/svg/X";

export function Footer() {
    return (
        <footer className="flex flex-col items-center justify-center bg-light transition-colors dark:bg-dark">
            <Separator className="mb-8" />
            <span className="text-lg font-semibold text-black dark:text-white">Capadura</span>

            <div className="mt-4 flex items-center gap-6">
                <div className="fill-muted-foreground hover:fill-black">
                    <Instagram size={24} />
                </div>
                <div className="fill-muted-foreground hover:fill-black">
                    <X size={24} />
                </div>
            </div>

            <p className="mt-5 text-muted-foreground">
                © {new Date().getFullYear()} Capadura. Todos direitos reservados.
            </p>
        </footer>
    );
}
