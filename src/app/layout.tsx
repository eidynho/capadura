import "@/styles/global.css";
import "react-toastify/dist/ReactToastify.css";

import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

import { Providers } from "@/contexts/Providers";
import { manrope } from "@/constants/fonts";

import { AuthDialog } from "@/components/AuthDialog";
import { MainContainer } from "@/components/layout/MainContainer";

interface RootLayoutProps {
    children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="pt">
            <head>
                <meta
                    name="description"
                    content="Conecte-se com apaixonados por livros, descubra recomendações, compartilhe leituras e explore um mundo literário colaborativo. Junte-se a nós!"
                />
            </head>
            <body className="bg-white transition-colors dark:bg-dark">
                <div className={`${manrope.variable} mx-auto max-w-[120rem] font-manrope`}>
                    <Providers>
                        <div className="flex flex-col">
                            <MainContainer>{children}</MainContainer>
                        </div>

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
                        <AuthDialog />
                    </Providers>
                </div>
            </body>
        </html>
    );
}
