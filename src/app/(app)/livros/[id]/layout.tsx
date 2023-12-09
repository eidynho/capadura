import { ReactNode, Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";
import { ImageOff } from "lucide-react";

import { BASE_URL } from "@/constants/api";
import { fetchBookData } from "@/utils/fetch-book-data";

import Loading from "./loading";

import { BookHeader } from "./components/BookHeader";
import { BookMetaData } from "./components/BookMetaData";
import { RatingChart } from "@/components/RatingChart";

interface BookLayoutProps {
    children: ReactNode;
    params: {
        id: string;
    };
}

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata | null> {
    try {
        const bookData = await fetchBookData(params.id);
        if (!bookData) return null;

        return {
            title: {
                template: `${bookData.title}: %s | Capadura`,
                default: `${bookData.title} ${
                    bookData.authors[0] ? ` - ${bookData.authors[0]}` : ""
                }`,
            },
            description: bookData.description,
            alternates: {
                canonical: `${BASE_URL}/livros/${params.id}`,
            },
            openGraph: {
                title: bookData.title,
                description: bookData.description || undefined,
                images: bookData.imageUrl,
                url: `${BASE_URL}/livros/${params.id}`,
                type: "book",
                authors: bookData.authors,
            },
        };
    } catch (err) {
        console.error(err);
        return null;
    }
}

export default async function BookLayout({ children, params }: BookLayoutProps) {
    const bookData = await fetchBookData(params.id);
    if (!bookData) return;

    return (
        <div id="book-page-container">
            <div className="mt-5 flex flex-col items-start gap-8 md:flex-row">
                <div className="z-10 w-full md:w-[19.5rem]">
                    {/* Book header */}
                    <BookHeader
                        title={bookData.title}
                        subtitle={bookData.subtitle}
                        device="mobile"
                    />

                    {/* Book image */}
                    <div className="flex w-full gap-6">
                        <canvas id="canvas" className="hidden"></canvas>
                        {bookData.imageUrl ? (
                            <Image
                                id="book-principal-image"
                                src={bookData.imageUrl}
                                width={312}
                                height={452}
                                quality={100}
                                loading="eager"
                                priority
                                alt={`Capa do livro ${bookData.title}`}
                                title={`Capa do livro ${bookData.title}`}
                                className="mx-auto h-[323px] w-52 rounded-md md:h-[452px] md:w-[312px]"
                                unoptimized
                            />
                        ) : (
                            <div className="flex h-[323px] w-full flex-col items-center justify-center rounded-md border bg-zinc-500/10 opacity-75 md:h-[452px]">
                                <ImageOff size={36} strokeWidth={1.6} />
                                <span className="mt-1 text-sm font-medium text-muted-foreground">
                                    Sem imagem
                                </span>
                            </div>
                        )}
                    </div>

                    <BookMetaData bookData={bookData} />

                    {/* Community rating */}
                    <RatingChart bookId={bookData.id} />
                </div>

                <div className="z-10 flex w-full flex-col md:w-[calc(100%-344px)]">
                    {/* Book header */}
                    <BookHeader
                        title={bookData.title}
                        subtitle={bookData.subtitle}
                        device="desktop"
                    />

                    <div className="flex w-full flex-col gap-8 xl:flex-row">
                        <div className="flex w-full flex-col gap-2">
                            <Suspense fallback={<Loading />}>{children}</Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
