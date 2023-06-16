import { NavBarComponent } from "./NavBar";
import { ButtonLink } from "@/components/ButtonLink";
import Link from "next/link";

export function Header() {
    return (
        <header>
            <NavBarComponent />
            <article className="py-5 w-full flex flex-col items-center justify-center gap-8 bg-fuchsia-300 lg:mx-0 lg:mt-0 lg:flex-row">
                <div className="max-w-2xl flex flex-col gap-12">
                    <h1 className="text-8xl font-medium">
                        Transcrição em segundos
                    </h1>
                    <span className="text-2xl font-medium">
                        Economize tempo gerando textos a partir de um áudio em
                        questão de segundos e utilize seu tempo no que realmente
                        importa.
                    </span>
                    <ButtonLink
                        href="/signup"
                        size="lg"
                        className="self-start bg-black hover:bg-pink-700"
                    >
                        Começar
                    </ButtonLink>
                </div>
                <div>
                    <div className="w-[36rem] h-[36rem] bg-yellow-400 rounded-full"></div>
                </div>
            </article>
        </header>
    );
}
