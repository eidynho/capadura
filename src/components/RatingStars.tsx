import { Star, StarHalf } from "phosphor-react";
import { twMerge } from "tailwind-merge";

interface RatingStarsProps {
    rating: number;
    size?: number;
    className?: string;
}

export function RatingStars({ rating, size = 16, className }: RatingStarsProps) {
    if (rating === 0) return <></>;

    const isInteger = Number.isInteger(rating);
    const ratingFloor = Math.floor(rating);

    const renderIntegerStars = () => {
        return [...Array(ratingFloor)].map((_, index) => (
            <Star key={index} size={size} weight="fill" />
        ));
    };

    return (
        <div className={twMerge("inline-flex items-center", className)}>
            {renderIntegerStars()}
            {!isInteger && <StarHalf size={size} weight="fill" />}
        </div>
    );
}
