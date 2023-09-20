"use client";

import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import { FeatureSection } from "@/components/layout/FeatureSection";
import { FAQSection } from "@/components/layout/FAQSection";
import { CTASection } from "@/components/layout/CTASection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
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
