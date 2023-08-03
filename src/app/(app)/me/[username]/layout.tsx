import { ReactNode } from "react";

interface MeLayoutProps {
    children: ReactNode;
}

interface MeLayout {
    params: {
        username: string;
    };
}

export function generateMetadata({ params }: MeLayout) {
    return {
        title: `${params.username}`,
    };
}

export default function MeLayout({ children }: MeLayoutProps) {
    return <div>{children}</div>;
}
