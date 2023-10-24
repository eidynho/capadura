"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { ProgressBar } from "../ProgressBar";
import { Textarea } from "@/components/ui/Textarea";

const updateProgressFormSchema = z.object({
    description: z.string().optional(),
    isSpoiler: z.boolean().default(false),
});

type UpdateProgressFormSchema = z.infer<typeof updateProgressFormSchema>;

export interface HandleUpdateProgressProps {
    id: string;
    readId: string;
    description?: string;
    isSpoiler: boolean;
}

interface FormUpdateDialogProps {
    bookPageCount: number;
    editData: {
        readId: string;
        id: string;
        description: string;
        isSpoiler: boolean;
        page: number;
        percentage: number;
        countType: "page" | "percentage";
    };
    handleUpdateProgress: (data: HandleUpdateProgressProps) => Promise<void>;
    setIsOpen: (value: boolean) => void;
}

export function FormUpdateDialog({
    bookPageCount,
    editData,
    handleUpdateProgress,
    setIsOpen,
}: FormUpdateDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        setValue,
    } = useForm<UpdateProgressFormSchema>({
        resolver: zodResolver(updateProgressFormSchema),
        defaultValues: {
            isSpoiler: false,
        },
    });

    useEffect(() => {
        if (editData) {
            setValue("description", editData.description);
            setValue("isSpoiler", editData.isSpoiler);
        }
    }, [editData]);

    async function updateProgress({ description, isSpoiler }: UpdateProgressFormSchema) {
        try {
            if (!editData?.id) {
                throw new Error("Missing id to update progress");
            }

            await handleUpdateProgress({
                id: editData.id,
                readId: editData.readId,
                description,
                isSpoiler,
            });

            setIsOpen(false);
        } catch (err) {
            throw err;
        }
    }

    return (
        <form
            onSubmit={handleSubmit(updateProgress)}
            className="flex w-full flex-col gap-4 text-black dark:text-white"
        >
            <div>
                <Label htmlFor="description-progress">Comentário</Label>
                <Textarea
                    {...register("description")}
                    name="description"
                    id="description-progress"
                    rows={4}
                    placeholder="O que está achando?"
                    className="mt-2 max-h-96"
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    {...register("isSpoiler")}
                    name="isSpoiler"
                    type="checkbox"
                    id="is-spoiler-checkbox"
                    className="h-4 w-4 accent-primary outline-black"
                />
                <Label htmlFor="is-spoiler-checkbox">Contém spoiler</Label>
            </div>

            <ProgressBar
                bookPageCount={bookPageCount}
                currentPage={editData.page}
                currentPercentage={editData.percentage}
            />

            <Button
                size="sm"
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="mt-3"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 size={22} className="animate-spin" />
                        <span>Salvando...</span>
                    </>
                ) : (
                    <span>Salvar</span>
                )}
            </Button>
        </form>
    );
}
