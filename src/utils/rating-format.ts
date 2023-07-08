export function ratingFormat(rating: number | null, isBeautify = true): number | null {
    if (typeof rating !== "number") return null;

    if (isBeautify) {
        switch (true) {
            case rating <= 0.1:
                return 0.0;
            case rating <= 0.175:
                return 0.5;
            case rating <= 0.3:
                return 1.0;
            case rating <= 0.375:
                return 1.5;
            case rating <= 0.5:
                return 2.0;
            case rating <= 0.575:
                return 2.5;
            case rating <= 0.7:
                return 3.0;
            case rating <= 0.775:
                return 3.5;
            case rating <= 0.9:
                return 4.0;
            case rating <= 0.95:
                return 4.5;
            case rating > 0.95:
                return 5.0;
            default:
                return 0;
        }
    } else {
        switch (true) {
            case rating === 0.0:
                return 0.1;
            case rating === 0.5:
                return 0.175;
            case rating === 1.0:
                return 0.3;
            case rating === 1.5:
                return 0.375;
            case rating === 2.0:
                return 0.5;
            case rating === 2.5:
                return 0.575;
            case rating === 3.0:
                return 0.7;
            case rating === 3.5:
                return 0.775;
            case rating === 4.0:
                return 0.9;
            case rating === 4.5:
                return 0.95;
            case rating === 5.0:
                return 1.0;
            default:
                return 0;
        }
    }
}
