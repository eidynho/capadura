"use client";

import { useWindowSize } from "@/hooks/useWindowSize";

import { Subtitle } from "@/components/Subtitle";
import { Title } from "@/components/Title";

interface BookHeaderProps {
    title: string;
    subtitle?: string | null;
    device: "mobile" | "desktop";
}

export function BookHeader({ title, subtitle, device }: BookHeaderProps) {
    const { width } = useWindowSize();

    const isMobile = !!width && width < 768 && device === "mobile";
    const isDesktop = !!width && width >= 768 && device === "desktop";

    return (
        <>
            {(isMobile || isDesktop) && (
                <div className="mb-3 flex flex-col items-center gap-2 md:items-start">
                    <Title>{title}</Title>
                    {subtitle && <Subtitle>{subtitle}</Subtitle>}
                </div>
            )}
        </>
    );
}
