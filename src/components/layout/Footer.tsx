import { Separator } from "@/components/ui/Separator";

export function Footer() {
    return (
        <footer className="flex flex-col items-center justify-center bg-light transition-colors dark:bg-dark">
            <Separator className="mb-8" />
            <span className="text-lg font-semibold text-black dark:text-white">Capadura</span>

            <p className="mt-5 text-muted-foreground">
                © {new Date().getFullYear()} Capadura. Todos direitos reservados.
            </p>
        </footer>
    );
}
