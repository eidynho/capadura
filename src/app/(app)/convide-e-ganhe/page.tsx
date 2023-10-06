"use client";

import { Copy, Twitter } from "lucide-react";
import { DiscordLogo, LinkedinLogo, WhatsappLogo } from "phosphor-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";
import { Subtitle } from "@/components/Subtitle";
import { Title } from "@/components/Title";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

export default function InviteAndWin() {
    return (
        <div className="flex gap-8 text-black dark:text-white">
            <div className="w-2/3">
                <Title className="mt-6">Convide e ganhe</Title>
                <Subtitle className="mt-6">
                    Que tal convidar aquele amigo que sempre te surpreende com recomendações de
                    livros incríveis? Na nossa comunidade de amantes da leitura, cada novo membro
                    enriquece nossa experiência compartilhando suas histórias literárias favoritas.
                </Subtitle>

                <Subtitle className="mt-4">
                    Ajude-nos a expandir nosso universo de livros e amizades. Convide seus amigos
                    agora e juntos vamos descobrir novos livros.
                </Subtitle>

                <div className="mt-8 flex h-10 items-center gap-2">
                    <div className="relative h-full flex-1">
                        <Input
                            readOnly
                            value="referral linkreferral linkreferral linkreferral linkreferral linkreferral linkreferral linkreferral linkreferral linkreferral linkreferral linkreferral link"
                            className="absolute truncate pr-12 focus-visible:ring-transparent"
                        />

                        <TooltipProvider delayDuration={400} skipDelayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="absolute right-0"
                                    >
                                        <Copy size={16} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent sideOffset={8}>
                                    <span>Copiar link</span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <Separator orientation="vertical" className="mx-2" />

                    <TooltipProvider delayDuration={400} skipDelayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="outline">
                                    <WhatsappLogo size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent sideOffset={8}>
                                <span>WhatsApp</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider delayDuration={400} skipDelayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="outline">
                                    <DiscordLogo size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent sideOffset={8}>
                                <span>Discord</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider delayDuration={400} skipDelayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="outline">
                                    <LinkedinLogo size={18} weight="bold" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent sideOffset={8}>
                                <span>LinkedIn</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider delayDuration={400} skipDelayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="outline">
                                    <Twitter size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent sideOffset={8}>
                                <span>Twitter</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <div className="flex w-1/3 flex-col items-center justify-center gap-2 rounded bg-primary/75 px-3 py-6 text-center">
                <span className="text-3xl font-semibold text-black">0</span>
                <span className="font-text-medium text-black">
                    amigos convidados se cadastraram
                </span>
            </div>
        </div>
    );
}
