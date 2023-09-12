import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";

interface DeleteReadDialogProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    deleteRead: () => void;
    isDeleteReadLoading: boolean;
}

export function DeleteReadDialog({
    isOpen,
    setIsOpen,
    deleteRead,
    isDeleteReadLoading,
}: DeleteReadDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Você tem certeza?</DialogTitle>
                    <DialogDescription>
                        Ao excluir a leitura, essa ação não poderá ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
                        Cancelar
                    </Button>

                    <Button size="sm" variant="destructive" onClick={deleteRead}>
                        {isDeleteReadLoading ? (
                            <>
                                <Loader2 size={22} className="animate-spin" />
                                <span>Excluindo...</span>
                            </>
                        ) : (
                            <span>Excluir leitura</span>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
