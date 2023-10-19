import { ReactNode } from "react";
import { Metadata } from "next";
import { cookies as NextCookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { BASE_URL } from "@/constants/api";
import { RatingsOptions } from "@/endpoints/queries/readsQueries";

interface BookReviewsLayoutProps {
    children: ReactNode;
    params: {
        id: string;
        rating: RatingsOptions;
    };
}

export function generateMetadata({ params }: BookReviewsLayoutProps): Metadata {
    return {
        title: `avaliações nota ${params.rating}`,
        alternates: {
            canonical: `${BASE_URL}/livros/${params.id}/avaliacoes/${params.rating}`,
        },
    };
}

function validateRating(rating: RatingsOptions) {
    const acceptedRatings = ["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"];
    const isValidRating = acceptedRatings.indexOf(rating) !== -1;

    if (!isValidRating) {
        notFound();
    }
}

export default async function BookReviewsLayout({ children, params }: BookReviewsLayoutProps) {
    validateRating(params.rating);

    const cookies = NextCookies();
    const token = cookies.get("token");

    if (!!cookies && !token) {
        redirect("/entrar");
    } else {
        return <>{children}</>;
    }
}
