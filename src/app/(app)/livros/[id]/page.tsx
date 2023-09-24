import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ImageOff } from "lucide-react";

import { API_BASE_URL, BASE_URL } from "@/constants/api";

import { BookData } from "@/endpoints/queries/booksQueries";

import { BookGradient } from "./components/BookGradient";
import { BookHeader } from "./components/BookHeader";
import { BookMetaData } from "./components/BookMetaData";
import { Container } from "@/components/layout/Container";
import { RatingChart } from "@/components/RatingChart";
import { ReadsProgress } from "./components/Read";

interface BookProps {
    params: {
        id: string;
    };
}

export async function generateMetadata({ params }: BookProps): Promise<Metadata> {
    try {
        const response = await fetch(`${BASE_URL}/api/book/${params.id}`);
        const { data: bookData }: { data: BookData } = await response.json();

        return {
            title: bookData.title,
            alternates: {
                canonical: `${BASE_URL}/livros/${params.id}`,
            },
        };
    } catch (err) {
        notFound();
    }
}

const getBookData = async (bookId: string) => {
    const response = await fetch(`${API_BASE_URL}/book/${bookId}`);
    const data = await response.json();

    return data as BookData;
};

export default async function Book({ params }: BookProps) {
    const bookData = await getBookData(params.id);

    return (
        <Container>
            <BookGradient bookImageUrl={bookData.imageUrl} />

            <div className="mt-5 flex flex-col items-start justify-center gap-8 md:flex-row">
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
                                height={468}
                                quality={100}
                                loading="eager"
                                priority
                                alt={`Capa do livro ${bookData.title}`}
                                title={`Capa do livro ${bookData.title}`}
                                className="mx-auto rounded-md"
                            />
                        ) : (
                            <div className="flex h-96 w-full flex-col items-center justify-center rounded-md border bg-zinc-500/10 opacity-75">
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
                            {/* Book content */}
                            <div
                                className="text-justify text-sm leading-7 text-black dark:text-muted-foreground"
                                dangerouslySetInnerHTML={{
                                    __html: bookData.description || "",
                                }}
                            ></div>

                            <ReadsProgress bookData={bookData} />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
