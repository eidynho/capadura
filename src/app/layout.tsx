"use client";

import { ReactNode } from "react";
import { Manrope } from "@next/font/google";

import { AuthProvider } from "@/contexts/AuthContext";

import "@/styles/global.css";
import { NavBarLoggedComponent } from "@/components/layout/NavBarLogged";
import { MainContainer } from "@/components/layout/MainContainer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const manrope = Manrope({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
    variable: "--font-manrope",
});

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="pt">
            <head>
                <meta
                    name="description"
                    content="Conecte-se com apaixonados por livros, descubra recomendações, compartilhe leituras e explore um mundo literário colaborativo. Junte-se a nós!"
                />
            </head>
            <body className="bg-white transition-colors dark:bg-black">
                <div className={`${manrope.variable} mx-auto max-w-[120rem] font-manrope`}>
                    <AuthProvider>
                        <div className="flex flex-col">
                            <NavBarLoggedComponent />
                            <MainContainer>{children}</MainContainer>

                            <ToastContainer
                                position="bottom-right"
                                autoClose={3000}
                                hideProgressBar
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss={false}
                                draggable
                                pauseOnHover
                                closeButton={false}
                                theme="light"
                            />
                        </div>
                    </AuthProvider>
                </div>
            </body>
        </html>
    );
}
