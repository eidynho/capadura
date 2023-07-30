import { ReactNode } from "react";

interface AppLayoutProps {
    children: ReactNode;
}

export const metadata = {
    title: {
        default: "Contopia",
        template: "%s | Contopia",
    },
};

export default function AppLayout({ children }: AppLayoutProps) {
    return <>{children}</>;
}
