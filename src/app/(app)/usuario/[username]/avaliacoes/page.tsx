import { ClientUserReviews } from "./components/ClientUserReviews";

interface UserReviewsProps {
    params: {
        username: string;
    };
}

export default async function UserReviews({ params }: UserReviewsProps) {
    return <ClientUserReviews username={params.username} />;
}
