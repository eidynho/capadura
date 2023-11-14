import { Header } from "@/components/layout/Header";
import { BookPageSection } from "@/components/layout/BookPageSection";
import { FeatureSection } from "@/components/layout/FeatureSection";
import { FAQSection } from "@/components/layout/FAQSection";
import { CTASection } from "@/components/layout/CTASection";
import { Footer } from "@/components/layout/Footer";

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
