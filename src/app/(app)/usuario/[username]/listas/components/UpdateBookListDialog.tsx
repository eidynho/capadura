import { useEffect, useState } from "react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Library, Loader2, PencilLine } from "lucide-react";

import { BookListData } from "@/endpoints/queries/bookListsQueries";

import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { ImageCropDialog } from "@/components/ImageCropDialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

const MAX_FILE_SIZE = 1024 * 1024 * 2; // 2 MB;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const updateBookListFormSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Campo obrigatório" })
        .max(80, { message: "Máximo 80 caracteres" }),
    description: z.string().max(600, { message: "Máximo 600 caracteres" }).optional(),
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
    activeBookList: number;
    bookLists: BookListData[];
    isUpdateBookListLoading: boolean;
    handleUpdateBookList: (name: string, description?: string, image?: any) => Promise<void>;
}

export function UpdateBookListDialog({
    activeBookList,
    bookLists,
    isUpdateBookListLoading,
    handleUpdateBookList,
}: UpdateBookListDialogProps) {
    const bookList = bookLists[activeBookList];

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenImageCropDialog, setIsOpenImageCropDialog] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
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
        if (isUpdateBookListLoading) return;

        try {
            await handleUpdateBookList(name, description, image[0]);

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
                            <PencilLine size={16} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={8}>
                        <span>Editar</span>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar detalhes</DialogTitle>
                    </DialogHeader>

                    <form
                        onSubmit={handleSubmit(submitUpdate)}
                        className="flex flex-col gap-6 text-black dark:text-white"
                    >
                        <div className="flex w-full gap-4">
                            <div className="flex flex-col">
                                <Label htmlFor="update-booklist-image">Foto de capa</Label>
                                <Controller
                                    name="image"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Label htmlFor="update-booklist-image">
                                                <div className="group relative mt-2 h-44 w-44 cursor-pointer overflow-hidden rounded-md bg-neutral-800 transition-all">
                                                    {selectedImage?.[0] || bookList.imageUrl ? (
                                                        <Image
                                                            src={
                                                                selectedImage?.[0]
                                                                    ? URL.createObjectURL(
                                                                          selectedImage[0],
                                                                      )
                                                                    : bookList.imageUrl || ""
                                                            }
                                                            width={176}
                                                            height={176}
                                                            quality={100}
                                                            loading="eager"
                                                            alt={`Capa da lista ${bookList.name}`}
                                                            title={`Capa da lista ${bookList.name}`}
                                                            className="rounded-md transition-all group-hover:brightness-50"
                                                            unoptimized
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

                                                    {selectedImage?.[0] && (
                                                        <ImageCropDialog
                                                            imageSrc={URL.createObjectURL(
                                                                selectedImage[0],
                                                            )}
                                                            isOpen={isOpenImageCropDialog}
                                                            setIsOpen={setIsOpenImageCropDialog}
                                                            onSave={(blobURL: File[]) => {
                                                                field.onChange(blobURL);
                                                                setIsOpenImageCropDialog(false);
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </Label>

                                            <Input
                                                {...register("image")}
                                                id="update-booklist-image"
                                                name="image"
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => {
                                                    field.onChange(e.target.files);
                                                    setIsOpenImageCropDialog(true);
                                                }}
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
                                        maxLength={80}
                                        className={`${
                                            errors.name ? "border-destructive" : ""
                                        } mt-2 w-full`}
                                    />
                                    {errors.name && (
                                        <span className="mt-1 text-xs font-medium text-destructive">
                                            {errors.name.message}
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
                                        maxLength={600}
                                        className="mt-2 max-h-40"
                                    />
                                    {errors.description && (
                                        <span className="mt-1 text-xs font-medium text-destructive">
                                            {errors.description.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Button
                            size="sm"
                            variant="primary"
                            type="submit"
                            disabled={isUpdateBookListLoading}
                        >
                            {isUpdateBookListLoading ? (
                                <>
                                    <Loader2 size={22} className="animate-spin" />
                                    <span>Salvando...</span>
                                </>
                            ) : (
                                <span>Salvar</span>
                            )}
                        </Button>
                    </form>

                    <DialogClose />
                </DialogContent>
            </Dialog>
        </>
    );
}
