import { ReactNode } from "react";

interface UserListsLayoutProps {
    children: ReactNode;
}

export default function UserListsLayout({ children }: UserListsLayoutProps) {
    return <div>{children}</div>;
}
