"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function NavBarComponent() {
    return (
        <section className="flex items-center justify-between border-b-2 border-black px-8 py-4">
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
                <Button size="sm" variant="black">
                    <Link href="/">Entrar</Link>
                </Button>
                <Button size="sm" variant="black">
                    <Link href="/">Cadastrar</Link>
                </Button>
            </div>
        </section>
    );
}
