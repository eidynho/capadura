import { useColorPalette } from "@/hooks/useColorPalette";

interface BookGradientProps {
    bookImageUrl?: string;
}

export function BookGradient({ bookImageUrl }: BookGradientProps) {
    const palette = useColorPalette(bookImageUrl);

    const gradientStyle = {
        background: `linear-gradient(45deg, ${palette.join(", ")})`,
    };

    return (
        <>
            <div
                className="absolute left-0 top-0 z-0 h-[32rem] w-full opacity-50 transition-all dark:opacity-30 md:h-96"
                style={gradientStyle}
            ></div>
            <div className="absolute left-0 top-0 z-0 h-[32rem] w-full bg-gradient-to-t from-light transition-all dark:from-dark md:h-96"></div>
        </>
    );
}
