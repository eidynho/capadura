"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";

interface DeleteProgressDialogProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    deleteProgress: () => void;
    isDeleteProgressLoading: boolean;
}

export function DeleteProgressDialog({
    isOpen,
    setIsOpen,
    deleteProgress,
    isDeleteProgressLoading,
}: DeleteProgressDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Você tem certeza?</DialogTitle>
                    <DialogDescription>
                        Ao excluir o progresso, essa ação não poderá ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
                        Cancelar
                    </Button>

                    <Button size="sm" variant="destructive" onClick={deleteProgress}>
                        {isDeleteProgressLoading ? (
                            <>
                                <Loader2 size={22} className="animate-spin" />
                                <span>Excluindo...</span>
                            </>
                        ) : (
                            <span>Excluir progresso</span>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
