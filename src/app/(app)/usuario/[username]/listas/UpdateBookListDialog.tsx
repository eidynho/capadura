import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Library, Loader2, PencilLine } from "lucide-react";
import { toast } from "react-toastify";

import { api } from "@/lib/api";
import { BookListData } from "./page";

import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

const MAX_FILE_SIZE = 1024 * 1024 * 2; // 2 MB;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const updateBookListFormSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    image: z
        .any()
        .refine(
            (file) => {
                if (!file || file.length === 0) {
                    return true;
                }

                return file[0]?.size <= MAX_FILE_SIZE;
            },
            {
                message: "O tamanho máximo é 2MB.",
            },
        )
        .refine(
            (file) => {
                if (!file || file.length === 0) {
                    return true;
                }

                return ACCEPTED_IMAGE_TYPES.includes(file[0]?.type);
            },
            {
                message: "Formatos permitidos: .jpg, .jpeg, .png and .webp.",
            },
        ),
});

type UpdateBookListFormSchema = z.infer<typeof updateBookListFormSchema>;

interface UpdateBookListDialogProps {
    currentList: number;
    bookLists: BookListData[];
    setBookLists: Dispatch<SetStateAction<BookListData[] | null>>;
}

export function UpdateBookListDialog({
    currentList,
    bookLists,
    setBookLists,
}: UpdateBookListDialogProps) {
    const bookList = bookLists[currentList];

    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        setValue,
        control,
        watch,
    } = useForm<UpdateBookListFormSchema>({
        resolver: zodResolver(updateBookListFormSchema),
    });

    useEffect(() => {
        setValue("name", bookList.name);
        setValue("description", bookList.description);
    }, [isOpen]);

    const selectedImage = watch("image");

    async function submitUpdate({ name, description, image }: UpdateBookListFormSchema) {
        try {
            const { data } = await api.putForm("/booklists", {
                bookListId: bookList.id,
                name,
                description,
                image: image[0],
            });

            setBookLists((prev) => {
                if (!prev) return null;

                const updatedBookLists = [...prev];

                updatedBookLists[currentList].name = name;

                if (description) {
                    updatedBookLists[currentList].description = description;
                }

                if (image) {
                    updatedBookLists[currentList].imageUrl = data.imageUrl;
                }

                return updatedBookLists;
            });

            toast.success("Lista atualizada com sucesso.");
            setIsOpen(false);
        } catch (err) {
            toast.error("Erro ao atualizar a lista.");
            throw err;
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger>
                    <TooltipProvider delayDuration={400} skipDelayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="default">
                                    <PencilLine size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Editar</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar detalhes</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(submitUpdate)} className="flex flex-col gap-6">
                        <div className="flex w-full gap-4">
                            <div className="flex flex-col">
                                <Label htmlFor="update-booklist-image">Foto de capa</Label>
                                <Controller
                                    name="image"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Label htmlFor="update-booklist-image">
                                                <div className="group relative mt-2 cursor-pointer rounded-md bg-neutral-800 transition-all">
                                                    {selectedImage?.[0] || bookList.imageUrl ? (
                                                        <Image
                                                            src={
                                                                selectedImage?.[0]
                                                                    ? URL.createObjectURL(
                                                                          selectedImage[0],
                                                                      )
                                                                    : bookList.imageUrl || ""
                                                            }
                                                            alt=""
                                                            width={176}
                                                            height={176}
                                                            className="rounded-md transition-all group-hover:brightness-50"
                                                        />
                                                    ) : (
                                                        <div className="flex h-44 w-44 items-center justify-center rounded-md text-white">
                                                            <Library
                                                                size={32}
                                                                className="group-hover:hidden"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-white group-hover:block">
                                                        <PencilLine size={32} />
                                                    </div>
                                                </div>
                                            </Label>

                                            <Input
                                                {...register("image")}
                                                id="update-booklist-image"
                                                name="image"
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => field.onChange(e.target.files)}
                                            />
                                        </>
                                    )}
                                ></Controller>
                            </div>

                            <div className="flex w-full flex-1 flex-col gap-4">
                                <div className="flex flex-col">
                                    <Label htmlFor="update-booklist-name">Título</Label>
                                    <Input
                                        {...register("name")}
                                        id="update-booklist-name"
                                        name="name"
                                        type="text"
                                        maxLength={50}
                                        className={`${
                                            errors.name ? "border-destructive" : ""
                                        } mt-2 w-full`}
                                    />
                                    {errors.name && (
                                        <span className="mt-1 text-xs font-semibold text-destructive">
                                            Campo obrigatório
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <Label htmlFor="update-booklist-description">Descrição</Label>
                                    <Textarea
                                        {...register("description")}
                                        id="update-booklist-description"
                                        name="description"
                                        rows={4}
                                        className="mt-2 max-h-40 bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button size="sm" variant="black" type="submit" disabled={isSubmitting}>
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
                </DialogContent>
            </Dialog>
        </>
    );
}
