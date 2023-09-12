import { Loader2 } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";

interface DeleteBookListDialogProps {
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
}: DeleteBookListDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ao excluir o progresso, essa ação não poderá ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction asChild>
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
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
