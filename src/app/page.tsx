import { Metadata } from "next";

import { Header } from "@/components/layout/Header";
import { FeatureSection } from "@/components/layout/FeatureSection";
import { FAQSection } from "@/components/layout/FAQSection";
import { CTASection } from "@/components/layout/CTASection";
import { Footer } from "@/components/layout/Footer";
import { BookPageSection } from "@/components/layout/BookPageSection";

export const metadata: Metadata = {
    title: "A rede social de livros | Capadura",
};

export default async function Home() {
    return (
        <>
            <Header />
            <BookPageSection />
            <FeatureSection />
            <FAQSection />
            <CTASection />
            <Footer />
        </>
    );
}
