import { ReactNode } from "react";

interface UserLikesLayoutProps {
    children: ReactNode;
}

export default async function UserLikesLayout({ children }: UserLikesLayoutProps) {
    return <>{children}</>;
}
