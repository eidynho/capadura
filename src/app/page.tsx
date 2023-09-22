import { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import { FeatureSection } from "@/components/layout/FeatureSection";
import { FAQSection } from "@/components/layout/FAQSection";
import { CTASection } from "@/components/layout/CTASection";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "A rede social de livros | Capadura",
};

export default async function Home() {
    return (
        <Container>
            <Header />
            <FeatureSection />
            <FAQSection />
            <CTASection />
            <Footer />
        </Container>
    );
}
