import { useContext, useState } from "react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Library, Loader2, PencilLine, PlusCircle } from "lucide-react";

import { AuthContext } from "@/contexts/AuthContext";

import { useCreateBookList } from "@/endpoints/mutations/bookListsMutations";

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

const MAX_FILE_SIZE = 1024 * 1024 * 2; // 2 MB;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const createBookListFormSchema = z.object({
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

type CreateBookListFormSchema = z.infer<typeof createBookListFormSchema>;

export function CreateBookListDialog() {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
        reset,
    } = useForm<CreateBookListFormSchema>({
        resolver: zodResolver(createBookListFormSchema),
    });

    const createBookList = useCreateBookList();
    async function submitUpdate({ name, description, image }: CreateBookListFormSchema) {
        if (createBookList.isLoading) return;

        try {
            createBookList.mutate(
                {
                    userId: user?.id || "",
                    name,
                    description,
                    image: image?.[0],
                },
                {
                    onSuccess: () => {
                        setIsOpen(false);
                        reset();
                    },
                },
            );
        } catch (err) {
            throw err;
        }
    }

    const selectedImage = watch("image");

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" variant="primary">
                        <PlusCircle size={16} />
                        Nova lista
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Criar lista</DialogTitle>
                    </DialogHeader>

                    <form
                        onSubmit={handleSubmit(submitUpdate)}
                        className="flex flex-col gap-6 text-black dark:text-white"
                    >
                        <div className="flex w-full gap-4">
                            <div className="flex flex-col">
                                <Label htmlFor="create-booklist-image">Foto de capa</Label>
                                <Controller
                                    name="image"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Label htmlFor="create-booklist-image">
                                                <div className="group relative mt-2 h-44 w-44 cursor-pointer overflow-hidden rounded-md bg-neutral-800 transition-all">
                                                    {selectedImage?.[0] ? (
                                                        <Image
                                                            src={URL.createObjectURL(
                                                                selectedImage[0],
                                                            )}
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
                                                id="create-booklist-image"
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
                                    <Label htmlFor="create-booklist-name">Título</Label>
                                    <Input
                                        {...register("name")}
                                        id="create-booklist-name"
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
                                    <Label htmlFor="create-booklist-description">Descrição</Label>
                                    <Textarea
                                        {...register("description")}
                                        id="create-booklist-description"
                                        name="description"
                                        rows={4}
                                        maxLength={600}
                                        className="mt-2 max-h-40 bg-white dark:bg-dark"
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
                            disabled={createBookList.isLoading}
                        >
                            {createBookList.isLoading ? (
                                <>
                                    <Loader2 size={22} className="animate-spin" />
                                    <span>Criando...</span>
                                </>
                            ) : (
                                <span>Criar lista</span>
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
