"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";

export function EditProfileButton() {
    const routePathname = usePathname();
    const username = routePathname.split("/")[2];

    const isCurrentUser = isPageUserSameCurrentUser(username);

    return (
        <>
            {isCurrentUser && (
                <Button asChild size="sm" variant="black">
                    <Link href={`${document.location.pathname}/config`}>Editar perfil</Link>
                </Button>
            )}
        </>
    );
}
