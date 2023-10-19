import { RatingsOptions } from "@/endpoints/queries/readsQueries";

import { ClientBookReviews } from "./components/ClientBookReviews";

interface BookReviewsProps {
    params: {
        id: string;
        rating: RatingsOptions;
    };
}

export default async function BookReviews({ params }: BookReviewsProps) {
    return <ClientBookReviews bookId={params.id} rating={params.rating} />;
}
