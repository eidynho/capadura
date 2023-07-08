import { Star, StarHalf } from "phosphor-react";

interface RatingStarsProps {
    rating: number;
    size?: number;
}

export function RatingStars({ rating, size = 16 }: RatingStarsProps) {
    if (rating === 0) return <></>;

    const isInteger = Number.isInteger(rating);
    const ratingFloor = Math.floor(rating);

    const renderIntegerStars = () => {
        return [...Array(ratingFloor)].map((_, index) => (
            <Star key={index} size={size} weight="fill" />
        ));
    };

    return (
        <>
            {renderIntegerStars()}
            {!isInteger && <StarHalf size={size} weight="fill" />}
        </>
    );
}
