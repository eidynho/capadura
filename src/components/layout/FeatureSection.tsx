import { BarChart4, BookmarkX, List, Users2 } from "lucide-react";

const features = [
    {
        name: "Métricas de leitura",
        description:
            "Afinal, quem não gosta de ver o progresso? Saiba quantas páginas/livros você leu por período e bata suas metas a partir disso.",
        icon: BarChart4,
    },
    {
        name: "Organização por listas",
        description:
            "Que tal separar seus livros por gênero ou por data de leitura? As listas são o melhor lugar para isso, e melhor, dá para compartilhar com os amigos.",
        icon: List,
    },
    {
        name: "Saiba o que seus amigos estão lendo",
        description:
            "Com isso você consegue saber quais livros aquela pessoa está lendo e facilita na hora de puxar um assunto ou discutir sobre o final de tal livro.",
        icon: Users2,
    },
    {
        name: "Tendências",
        description:
            "Fique por dentro dos livros mais lidos da comunidade, quem sabe assim você não descobre um gênero novo favorito.",
        icon: BookmarkX,
    },
];

export function FeatureSection() {
    return (
        <div className="bg-light py-12 dark:bg-dark lg:py-16">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="inline-block rounded-md bg-yellow-200 px-1 text-base font-semibold leading-7 text-black">
                        Sua versão leitor(a) agradece
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
                        Tudo que você precisa para complementar sua leitura
                    </p>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        A leitura fica muito mais divertida quando você consegue mensurar seu
                        progresso, compartilhar com amigos e ficar por dentro das novas tendências.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-black dark:text-white">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                        <feature.icon
                                            className="text-black"
                                            size={20}
                                            aria-hidden="true"
                                        />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-muted-foreground">
                                    {feature.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
