import { ClientUserReads } from "./components/ClientUserReads";

interface UserReadsProps {
    params: {
        username: string;
    };
}

export default async function UserReads({ params }: UserReadsProps) {
    return <ClientUserReads username={params.username} />;
}
