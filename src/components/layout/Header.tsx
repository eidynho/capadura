import { NavBarComponent } from "./NavBar";
import { ButtonLink } from "@/components/ButtonLink";
import Link from "next/link";

export function Header() {
    return (
        <header>
            <NavBarComponent />
            <article className="flex w-full flex-col items-center justify-center gap-8 bg-fuchsia-300 py-5 lg:mx-0 lg:mt-0 lg:flex-row">
                <div className="flex max-w-2xl flex-col gap-12">
                    <h1 className="text-8xl font-medium">Contopia</h1>
                    <span className="text-2xl font-medium">Sua rede social de livros</span>
                    <ButtonLink
                        href="/signup"
                        size="lg"
                        className="self-start bg-black hover:bg-pink-700"
                    >
                        Começar
                    </ButtonLink>
                </div>
                <div>
                    <div className="h-[36rem] w-[36rem] rounded-full bg-yellow-400"></div>
                </div>
            </article>
        </header>
    );
}
