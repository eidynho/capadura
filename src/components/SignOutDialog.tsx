"use client";

import { Home, LogOut } from "lucide-react";

import { signOut } from "@/utils/sign-out";

import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";

interface SignOutDialogProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmação de saída</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Você tem certeza de que deseja sair da plataforma?
                </DialogDescription>

                <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={signOut}>
                        <LogOut size={16} />
                        Sair
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => onOpenChange(false)}>
                        <Home size={16} />
                        Continuar navegando
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
