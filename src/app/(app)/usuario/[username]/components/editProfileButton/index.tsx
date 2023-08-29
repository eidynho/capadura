"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { isPageUserSameCurrentUser } from "@/utils/is-page-user-same-current-user";

interface EditProfileButtonProps {
    username: string;
}

export function EditProfileButton({ username }: EditProfileButtonProps) {
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
