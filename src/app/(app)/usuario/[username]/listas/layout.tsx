import { ReactNode } from "react";

interface UserListsLayoutProps {
    children: ReactNode;
}

export default async function UserListsLayout({ children }: UserListsLayoutProps) {
    return <>{children}</>;
}
