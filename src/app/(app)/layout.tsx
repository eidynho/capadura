import { ReactNode } from "react";

interface AppLayoutProps {
    children: ReactNode;
}

export const metadata = {
    title: {
        default: "Capadura",
        template: "%s | Capadura",
    },
};

export default async function AppLayout({ children }: AppLayoutProps) {
    return <>{children}</>;
}
