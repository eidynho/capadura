import { ClientUserLikes } from "./components/ClientUserLikes";

interface UserLikesProps {
    params: {
        username: string;
    };
}

export default async function UserLikes({ params }: UserLikesProps) {
    return <ClientUserLikes username={params.username} />;
}
