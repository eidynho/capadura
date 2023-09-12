import { useEffect, useState } from "react";
import { Loader2, Trash } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

interface DeleteBookListDialogProps {
    bookListId: string;
    isDeleteBookLoading: boolean;
    handleDeleteBookList: (bookListId: string) => Promise<void>;
}

export function DeleteBookListDialog({
    bookListId,
    isDeleteBookLoading,
    handleDeleteBookList,
}: DeleteBookListDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [typedName, setTypedName] = useState("");

    useEffect(() => {
        setTypedName("");
    }, [isOpen]);

    const confirmMessage = "deletar permanentemente";

    async function confirmDeleteBookList() {
        if (typedName !== "deletar permanentemente" || isDeleteBookLoading) return;

        try {
            await handleDeleteBookList(bookListId);
            setIsOpen(false);
        } catch (err) {
            throw err;
        }
    }

    return (
        <>
            <TooltipProvider delayDuration={400} skipDelayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="default" onClick={() => setIsOpen(true)}>
                            <Trash size={16} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={8}>
                        <span>Deletar</span>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Deletar lista</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Ao deletar uma lista, todos os livros da lista serão deletados e a ação não
                        poderá ser revertida.
                    </DialogDescription>

                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground">
                            Para confirmar a deleção, digite
                            <span className="mx-1 font-bold italic text-black dark:text-white">
                                deletar permanentemente
                            </span>
                            abaixo.
                        </p>
                        <Input
                            onChange={(e) => setTypedName(e.target.value)}
                            autoFocus
                            placeholder={confirmMessage}
                            className="mb-2 text-black placeholder:italic dark:text-white"
                        />

                        <Button
                            size="sm"
                            variant="destructive"
                            type="submit"
                            onClick={confirmDeleteBookList}
                            disabled={typedName !== confirmMessage || isDeleteBookLoading}
                        >
                            {isDeleteBookLoading ? (
                                <>
                                    <Loader2 size={22} className="animate-spin" />
                                    <span>Deletando...</span>
                                </>
                            ) : (
                                <span>Deletar lista</span>
                            )}
                        </Button>
                    </div>

                    <DialogClose />
                </DialogContent>
            </Dialog>
        </>
    );
}
