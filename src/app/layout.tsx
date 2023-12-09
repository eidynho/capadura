import "@/styles/global.css";

import { ReactNode } from "react";
import { Metadata } from "next";

import { BASE_URL } from "@/constants/api";
import { manrope } from "@/constants/fonts";
import { Providers } from "@/contexts/Providers";

import { AuthDialog } from "@/components/AuthDialog";
import { Container } from "@/components/layout/Container";
import { MainContainer } from "@/components/layout/MainContainer";
import { Toaster } from "@/components/ui/Toaster";

interface RootLayoutProps {
    children: ReactNode;
}

export const metadata: Metadata = {
    title: {
        template: "%s | Capadura",
        default: "A sua rede social de livros | Capadura",
    },
    description:
        "Conecte-se com apaixonados por livros, descubra recomendações, compartilhe leituras e explore um mundo literário colaborativo. Junte-se a nós!",
    alternates: {
        canonical: `${BASE_URL}`,
    },
};

export default async function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="pt">
            <body className="bg-white transition-colors dark:bg-dark">
                <div className={`${manrope.variable} mx-auto max-w-[120rem] font-manrope`}>
                    <Providers>
                        <div className="flex flex-col">
                            <MainContainer>
                                <Container>{children}</Container>
                            </MainContainer>
                        </div>

                        <Toaster />
                        <AuthDialog />
                    </Providers>
                </div>
            </body>
        </html>
    );
}
