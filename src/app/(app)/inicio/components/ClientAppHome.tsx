"use client";

import { useAuthContext } from "@/contexts/AuthContext";

import { PagesReadedChart } from "./PagesReadedChart";
import { Separator } from "@/components/ui/Separator";
import { Subtitle } from "@/components/Subtitle";
import { Title } from "@/components/Title";
import { LastUsersReads } from "./LastUserReads";

export function ClientAppHome() {
    const { user } = useAuthContext();

    if (!user?.username) return;

    return (
        <>
            <Title>Olá, {user.username},</Title>
            <Subtitle>Bem vindo(a) de volta.</Subtitle>

            <Separator className="my-6" />

            <PagesReadedChart />

            <LastUsersReads />
        </>
    );
}
