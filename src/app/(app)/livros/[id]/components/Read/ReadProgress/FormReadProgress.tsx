"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

export const progressFormSchema = z.object({
    description: z.string().optional(),
    isSpoiler: z.boolean().default(false),
    pagesCount: z.coerce.number().nonnegative().min(1, "Campo obrigatório"),
    countType: z.enum(["page", "percentage"]),
});

export type ProgressFormSchema = z.infer<typeof progressFormSchema>;

interface FormReadProgressProps {
    editData?: {
        readId: string;
        id: string;
        description: string;
        isSpoiler: boolean;
        page: number | null;
        countType: "page" | "percentage";
    } | null;
    submitForm: ({
        description,
        isSpoiler,
        pagesCount,
        countType,
    }: ProgressFormSchema) => Promise<void>;
}

export function FormReadProgress({ editData, submitForm }: FormReadProgressProps) {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        setValue,
    } = useForm<ProgressFormSchema>({
        resolver: zodResolver(progressFormSchema),
        defaultValues: {
            isSpoiler: false,
            countType: "page",
        },
    });

    useEffect(() => {
        if (editData) {
            setValue("description", editData.description);
            setValue("isSpoiler", editData.isSpoiler);
            setValue("pagesCount", editData.page || 0);
            setValue("countType", editData.countType);
        }
    }, [editData]);

    return (
        <form
            onSubmit={handleSubmit(submitForm)}
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
                    className="mt-2 max-h-96 bg-white"
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

            <div>
                <Label htmlFor="page-read-count">Páginas/porcentagem lidas</Label>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col">
                        <Input
                            {...register("pagesCount")}
                            id="page-read-count"
                            name="pagesCount"
                            type="number"
                            placeholder="0"
                            className={`${errors.pagesCount ? "border-destructive" : ""} mt-2 w-44`}
                        />
                        {errors.pagesCount && (
                            <span className="mt-1 text-xs font-medium text-destructive">
                                Campo obrigatório
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <input
                                {...register("countType")}
                                id="page-count-type"
                                type="radio"
                                value="page"
                                className="h-4 w-4 border-none accent-primary"
                            />
                            <Label htmlFor="page-count-type">Páginas</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                {...register("countType")}
                                id="percentage-count-type"
                                type="radio"
                                value="percentage"
                                className="h-4 w-4 border-none accent-primary"
                            />
                            <Label htmlFor="percentage-count-type">Porcentagem</Label>
                        </div>
                    </div>
                </div>
            </div>

            <Button size="sm" variant="primary" type="submit" disabled={isSubmitting}>
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
