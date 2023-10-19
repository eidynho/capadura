import { ClientUserLists } from "./components/ClientUserLists";

interface UserListsProps {
    params: {
        username: string;
    };
}

export default async function UserLists({ params }: UserListsProps) {
    return <ClientUserLists username={params.username} />;
}
