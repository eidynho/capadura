"use client";

import Image from "next/image";
import { BookMarked, Heart, List, Lock } from "lucide-react";

import { BookHeader } from "@/app/(app)/livros/[id]/components/BookHeader";

import { BookDescription } from "@/app/(app)/livros/[id]/components/BookDescription";
import { CardUserHover } from "@/components/CardUserHover";
import { RatingStars } from "../RatingStars";

import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

const bookData = {
    id: "6KwXEAAAQBAJ",
    title: "Tudo é rio",
    subtitle: null,
    authors: ["Carla Madeira"],
    publisher: "Editora Record",
    publishDate: "2021",
    language: "Português",
    pageCount: 210,
    description:
        '<p>Tudo é rio é o livro de estreia de Carla Madeira. Com uma narrativa madura, precisa e ao mesmo tempo delicada e poética, o romance narra a história do casal Dalva e Venâncio, que tem a vida transformada após uma perda trágica, resultado do ciúme doentio do marido, e de Lucy, a prostituta mais depravada e cobiçada da cidade, que entra no caminho deles, formando um triângulo amoroso. <br>Na orelha do livro, Martha Medeiros escreve: "Tudo é rio é uma obra-prima, e não há exagero no que afirmo. É daqueles livros que, ao ser terminado, dá vontade de começar de novo, no mesmo instante, desta vez para se demorar em cada linha, saborear cada frase, deixar-se abraçar pela poesia da prosa. Na primeira leitura, essa entrega mais lenta é quase impossível, pois a correnteza dos acontecimentos nos leva até a última página sem nos dar chance para respirar. É preciso manter-se à tona ou a gente se afoga." <br>A metáfora do rio se revela por meio da narrativa que flui - ora intensa, ora mais branda - de forma ininterrupta, mas também por meio do suor, da saliva, do sangue, das lágrimas, do sêmen, e Carla faz isso sem ser apelativa, sem sentimentalismo barato, com a habilidade que só os melhores escritores possuem.</p>',
    imageKey: "book-6KwXEAAAQBAJ",
    imageUrl: "/tudo-e-rio.jpg",
};

const readsList = [
    {
        id: 1,
        startDate: "20 de fevereiro de 2023",
        endDate: "24 de março de 2023",
        status: "FINISHED",
        isPrivate: true,
        reviewRating: 4.5,
        reviewContent:
            "Que livro incrível! A história te pega logo de cara e não te solta. Os personagens são tão reais que você sente como se fossem seus amigos. Além disso, o livro te faz pensar sobre a vida de uma forma profunda, sem ser chato.",
        progress: [
            {
                id: 1,
                description: "Simplesmente perfeito.",
                isSpoiler: false,
                page: 210,
                percentage: 100,
                createdAt: "24 de março de 2023",
            },
        ],
    },
];

const user = {
    id: "",
    name: "",
    username: "eidy",
    email: "",
    description: "hello world :)",
    location: "maringá",
    website: "https://viniciuseidy.com",
    twitter: "eidyota",
    imageKey: "",
    imageUrl: "/user-example.jpg",
};

export function BookPageSection() {
    return (
        <div className="relative my-12 max-h-[46rem] rounded-lg border border-zinc-300 bg-black/5 p-4 after:absolute after:-left-px after:top-1/2 after:h-64 after:w-px after:bg-gradient-to-t after:from-transparent after:via-yellow-600 after:to-transparent after:opacity-0 after:transition-all after:duration-500 after:content-[''] hover:after:top-1/4 hover:after:opacity-100 dark:border-border dark:bg-light/5 dark:after:via-primary lg:my-16">
            <div className="flex max-h-[43.75rem] flex-col items-start gap-8 overflow-hidden rounded-lg bg-light p-4 shadow-lg transition-colors dark:bg-dark dark:shadow-2xl md:flex-row">
                <div className="z-10 w-full md:w-[19.5rem]">
                    <BookHeader
                        title={bookData.title}
                        subtitle={bookData.subtitle}
                        device="mobile"
                    />

                    <div className="flex w-full gap-6">
                        <Image
                            src={bookData.imageUrl}
                            width={312}
                            height={468}
                            quality={100}
                            loading="eager"
                            priority
                            alt={`Capa do livro ${bookData.title}`}
                            title={`Capa do livro ${bookData.title}`}
                            className="mx-auto rounded-md"
                        />
                    </div>

                    <div className="my-3 flex justify-center gap-6 text-sm text-black dark:text-white">
                        <TooltipProvider delayDuration={200} skipDelayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2">
                                        <Heart size={16} />
                                        200k
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent sideOffset={8}>
                                    <span>
                                        Curtido por <span className="font-medium">200.202</span>{" "}
                                        membros
                                    </span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider delayDuration={200} skipDelayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2">
                                        <BookMarked size={16} />
                                        612k
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent sideOffset={8}>
                                    <span>
                                        Lido por <span className="font-medium">612.040</span>{" "}
                                        membros
                                    </span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider delayDuration={200} skipDelayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2">
                                        <List size={16} />
                                        20k
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent sideOffset={8}>
                                    <span>
                                        Aparece em <span className="font-medium">20.209</span>{" "}
                                        listas
                                    </span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="rounded-md border bg-white pb-4 text-black dark:bg-dark dark:text-white">
                        <div className="mx-4 mt-4 flex justify-between text-sm">
                            <span className="font-semibold">Escrito por</span>
                            <span className="font-semibold">{bookData.authors[0]}</span>
                        </div>

                        <Separator className="my-4" />

                        <div className="mx-4 flex justify-between text-sm">
                            <span className="font-semibold">Ano de publicação</span>
                            <span>{bookData.publishDate}</span>
                        </div>

                        <Separator className="my-4" />

                        <div className="mx-4 flex justify-between text-sm">
                            <span className="font-semibold">Editora</span>

                            <span>{bookData.publisher}</span>
                        </div>

                        <Separator className="my-4" />

                        <div className="mx-4 flex justify-between text-sm">
                            <span className="font-semibold">Idioma</span>

                            <span>{bookData.language}</span>
                        </div>

                        <Separator className="my-4" />

                        <div className="mx-4 flex justify-between text-sm">
                            <span className="font-semibold">Páginas</span>

                            <span>{bookData.pageCount}</span>
                        </div>
                    </div>
                </div>

                <div className="z-10 flex w-full flex-col md:w-[calc(100%-344px)]">
                    <BookHeader
                        title={bookData.title}
                        subtitle={bookData.subtitle}
                        device="desktop"
                    />

                    <div className="flex w-full flex-col gap-8 xl:flex-row">
                        <div className="flex w-full flex-col gap-2">
                            <BookDescription description={bookData.description} />

                            <div className="-mb-px mt-2 flex flex-wrap items-center justify-between text-center text-sm font-medium">
                                <div className="flex flex-wrap items-center gap-y-2 py-1">
                                    <div className="flex items-center gap-2 pl-2 pr-4 text-black dark:text-white">
                                        <BookMarked size={16} />
                                        <h2 className="font-semibold">Minhas leituras</h2>
                                    </div>
                                </div>
                            </div>

                            {readsList.map((read) => (
                                <div
                                    key={read.id}
                                    className="relative rounded-md border bg-white text-sm transition-colors dark:bg-dark"
                                >
                                    <div className="m-6 flex flex-col gap-2 rounded-md">
                                        {/* read active */}
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <CardUserHover user={user} />

                                                <Separator
                                                    orientation="vertical"
                                                    className="h-6"
                                                ></Separator>

                                                {/* Rating stars */}
                                                <div className="ml-1 inline-flex items-center gap-2">
                                                    <div className="inline-flex items-center">
                                                        <RatingStars rating={read.reviewRating} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Badge variant="green">Leitura finalizada</Badge>

                                                {/* Privacy badge */}
                                                <Badge variant="default">
                                                    <Lock size={12} />
                                                    Privado
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="my-1 flex flex-wrap items-center justify-between gap-2">
                                            <div className="text-sm font-medium text-muted-foreground">
                                                Início da leitura: {read.startDate}
                                            </div>
                                            {read.endDate && (
                                                <div className="text-sm font-medium text-muted-foreground">
                                                    Fim da leitura: {read.endDate}
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-justify text-black dark:text-white">
                                            {read.reviewContent}
                                        </p>

                                        <h3 className="my-2 font-bold text-black dark:text-white">
                                            Progressos recentes
                                        </h3>

                                        {read.progress.map((progress) => (
                                            <div key={progress.id} className="border-t p-4">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <CardUserHover user={user} />

                                                        <span className="mt-[2px] text-xs text-muted-foreground">
                                                            {progress.createdAt}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="mt-2 max-h-56 overflow-auto text-justify text-black dark:text-white">
                                                    {progress.description}
                                                </p>

                                                <div className="mt-4 flex items-center">
                                                    <div className="flex items-center gap-1 text-sm font-medium">
                                                        <span className="text-black dark:text-white">
                                                            {progress.page}
                                                        </span>
                                                    </div>
                                                    <div className="relative mx-2 h-5 flex-1 overflow-hidden rounded border bg-muted dark:bg-muted-foreground/25">
                                                        <div
                                                            className="h-5 bg-primary/50"
                                                            style={{
                                                                width:
                                                                    `${progress.percentage}%` ?? 0,
                                                            }}
                                                        ></div>
                                                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-black">
                                                            {`${progress.percentage}%`}
                                                        </span>
                                                    </div>
                                                    <span className="w-8 text-sm font-medium text-black dark:text-white">
                                                        {bookData.pageCount}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {/* end of progress */}
                                    </div>
                                </div>
                            ))}
                            {/* end of read */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
