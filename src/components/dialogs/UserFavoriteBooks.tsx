"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { PlusCircle } from "phosphor-react";

import { ProfileData } from "@/contexts/AuthContext";
import { UserData } from "@/app/(app)/me/[username]/page";

import { BaseDialog } from "../radix-ui/BaseDialog";
import { Button } from "../Button";
import { ApplicationSearch } from "../ApplicationSearch";

interface UserFavoriteBooksProps {
    user: ProfileData;
    setUserData: Dispatch<SetStateAction<UserData>>;
    itemId: number;
}

export function UserFavoriteBooks({ user, setUserData, itemId }: UserFavoriteBooksProps) {
    const [isOpen, setIsOpen] = useState(false);

    function handleToggleDialog(state = false) {
        setIsOpen(state);
    }

    return (
        <>
            <Button
                size="sm"
                onClick={() => handleToggleDialog(true)}
                className="h-64 w-44 bg-primary text-black enabled:hover:bg-yellow-500"
            >
                <PlusCircle size={32} />
            </Button>

            <BaseDialog
                size="max-w-2xl"
                title="Adicionar livro favorito"
                isOpen={isOpen}
                closeDialog={() => handleToggleDialog(false)}
            >
                {/* Dialog body */}
                <div className="flex justify-center px-4 py-6">
                    <ApplicationSearch
                        isLink={false}
                        user={user}
                        setUserData={setUserData}
                        itemId={itemId}
                        executeOnSelect={() => setIsOpen(false)}
                    />
                </div>
            </BaseDialog>
        </>
    );
}
