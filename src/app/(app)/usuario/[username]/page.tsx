import { ClientUser } from "./_components/ClientUser";

interface UserProps {
    params: {
        username: string;
    };
}

export default async function User({ params }: UserProps) {
    return <ClientUser username={params.username} />;
}
