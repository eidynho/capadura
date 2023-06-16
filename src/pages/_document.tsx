import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="icon" href="/favicon.ico" />

                <meta
                    name="description"
                    content="Conecte-se com apaixonados por livros, descubra recomendações, compartilhe leituras e explore um mundo literário colaborativo. Junte-se a nós!"
                />
            </Head>
            <body className="transition-colors bg-white dark:bg-black">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
