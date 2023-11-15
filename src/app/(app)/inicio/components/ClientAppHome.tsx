"use client";

import { useAuthContext } from "@/contexts/AuthContext";

import { PagesReadedChart } from "./PagesReadedChart";
import { Separator } from "@/components/ui/Separator";
import { Subtitle } from "@/components/Subtitle";
import { Title } from "@/components/Title";
import { LastUsersReads } from "./LastUserReads";

export function ClientAppHome() {
    const { user } = useAuthContext();

    return (
        <>
            <Title>Olá, {user?.username || "visitante"}</Title>
            {user && <Subtitle>Bem vindo(a) de volta.</Subtitle>}

            <Separator className="my-6" />

            <PagesReadedChart />

            <LastUsersReads />
        </>
    );
}
