import { AppProps } from "next/app";
import Head from "next/head";
import { Manrope, Space_Mono } from "@next/font/google";

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

export const spaceMono = Space_Mono({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-space-mono",
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>
                    Contopia | A rede social de livros que conecta leitores, recomendações e
                    descobertas literárias.
                </title>
            </Head>
            <div
                className={`${manrope.variable} font-manrope ${spaceMono.variable} font-space-mono mx-auto max-w-[120rem]`}
            >
                <AuthProvider>
                    <div className="flex flex-col">
                        <NavBarLoggedComponent />
                        <MainContainer>
                            <Component {...pageProps} />
                        </MainContainer>

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
        </>
    );
}
