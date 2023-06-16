import { Button } from "@/components/Button";
import Link from "next/link";

export function NavBarComponent() {
    return (
        <section className="py-4 px-8 flex items-center justify-between border-b-2 border-black">
            <div>
                <span>Contopia</span>
            </div>
            <nav>
                <ul className="flex gap-3">
                    <li>Features</li>
                    <li>Preço</li>
                    <li>Blog</li>
                </ul>
            </nav>
            <div className="flex items-center gap-2">
                <Button>
                    <Link href="/">Entrar</Link>
                </Button>
                <Button>
                    <Link href="/">Cadastrar</Link>
                </Button>
            </div>
        </section>
    );
}
