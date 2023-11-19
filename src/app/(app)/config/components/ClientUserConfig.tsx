"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { api } from "@/lib/api";
import { ProfileDataResponse } from "@/endpoints/queries/usersQueries";
import { signOut } from "@/utils/sign-out";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUpdateUserData } from "@/endpoints/mutations/usersMutations";
import { useToast } from "@/components/ui/UseToast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ImageCropDialog } from "@/components/ImageCropDialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { Subtitle } from "@/components/Subtitle";
import { Textarea } from "@/components/ui/Textarea";
import { Title } from "@/components/Title";

const configTabs = ["Perfil"];

const MAX_FILE_SIZE = 1024 * 1024 * 2; // 2 MB;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const profileFormSchema = z.object({
    id: z.string(),
    name: z
        .string()
        .min(1, { message: "Campo obrigatório." })
        .max(100, { message: "Máximo 100 caracteres." }),
    username: z
        .string()
        .min(1, { message: "Campo obrigatório." })
        .max(50, { message: "Máximo 50 caracteres." }),
    email: z
        .string()
        .max(200, { message: "Máximo 200 caracteres." })
        .email({ message: "E-mail inválido." }),
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
    description: z.string().max(600, { message: "Máximo 600 caracteres." }).optional().nullable(),
    location: z.string().max(50, { message: "Máximo 50 caracteres." }).optional().nullable(),
    website: z
        .union([z.literal(""), z.string().trim().url({ message: "URL inválida." })])
        .optional()
        .nullable(),
    twitter: z.string().optional().nullable(),
});

type ProfileFormSchema = z.infer<typeof profileFormSchema>;

export function ClientUserConfigs() {
    const { user } = useAuthContext();
    const { toast } = useToast();

    const [isValidatingUsername, setIsValidatingUsername] = useState(false);
    const [containsInvalidChars, setContainsInvalidChars] = useState(false);
    const [usernameAlreadyExists, setUsernameAlreadyExists] = useState(false);
    const [isOpenImageCropDialog, setIsOpenImageCropDialog] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        if (!user) return;

        setValue("id", user.id);
        setValue("name", user.name);
        setValue("username", user.username);
        setValue("email", user.email);
        setValue("description", user.description);
        setValue("location", user.location);
        setValue("website", user.website);
        setValue("twitter", user.twitter);
    }, [user]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        watch,
    } = useForm<ProfileFormSchema>({
        resolver: zodResolver(profileFormSchema),
    });

    const selectedImage = watch("image");
    const typedUsername = watch("username");

    const updateUserData = useUpdateUserData();
    function submitProfile(data: ProfileFormSchema) {
        if (!user) {
            return signOut();
        }

        if (isInvalidUsername) return;

        const { id, name, username, image, description, location, website, twitter } = data;

        // TODO: BE ABLE TO UPDATE E-MAIL (UNIQUE)
        updateUserData.mutate(
            {
                id,
                name,
                username: usernameAlreadyExists ? user.username : username,
                email: user.email,
                image: image[0],
                description: description ?? undefined,
                location: location ?? undefined,
                website: website ?? undefined,
                twitter: twitter ?? undefined,
            },
            {
                onSuccess: () => {
                    if (!description) {
                        setValue("description", "");
                    }
                    if (!location) {
                        setValue("location", "");
                    }
                    if (!website) {
                        setValue("website", "");
                    }
                    if (!twitter) {
                        setValue("twitter", "");
                    }

                    toast({
                        title: "Seu perfil foi atualizado.",
                    });
                },
            },
        );
    }

    async function verifyUsername() {
        if (!user) return;

        setIsValidatingUsername(true);

        // letters, numbers, dot and underscore
        const validCharactersRgx = /^[a-zA-Z0-9._]+$/;

        if (!validCharactersRgx.test(typedUsername)) {
            setContainsInvalidChars(true);
            setIsValidatingUsername(false);
            return;
        }
        setContainsInvalidChars(false);

        if (typedUsername.trim() === user.username) {
            setIsValidatingUsername(false);
            return;
        }

        try {
            const { data } = await api.get<ProfileDataResponse>(
                `users/username/${typedUsername.trim()}`,
            );
            const existsUsername = !!data.username;

            setUsernameAlreadyExists(existsUsername);
        } catch {
            toast({
                title: "Falha ao verificar se o usuário já existe.",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });

            throw new Error("Failed on verify user username.");
        } finally {
            setIsValidatingUsername(false);
        }
    }

    if (!user) return;

    const isInvalidUsername =
        !typedUsername || containsInvalidChars || usernameAlreadyExists || !!errors.username;

    return (
        <>
            <Title>Configurações</Title>
            <Subtitle>Gerencie as configurações da sua conta.</Subtitle>

            <Separator className="my-6" />

            <section className="mt-4 flex flex-col gap-8 text-black dark:text-white md:flex-row lg:gap-6 xl:gap-8">
                {currentTab === 0 && (
                    <>
                        <div className="w-full md:w-1/4">
                            <nav className="flex flex-col gap-1">
                                {configTabs.map((item, index) => (
                                    <div
                                        key={item}
                                        onClick={() => setCurrentTab(index)}
                                        className={`${
                                            currentTab === index
                                                ? "bg-muted-foreground text-white dark:bg-accent"
                                                : "hover:bg-muted-foreground/25 dark:hover:bg-accent/50"
                                        } cursor-pointer rounded-md px-4 py-2 text-sm`}
                                    >
                                        <span className="block w-full truncate">{item}</span>
                                    </div>
                                ))}
                            </nav>
                        </div>

                        <form
                            onSubmit={handleSubmit(submitProfile)}
                            className="flex w-full flex-col gap-8 md:w-3/4"
                        >
                            <div>
                                <h3 className="text-lg font-medium">Perfil</h3>
                                <span className="text-sm">
                                    Essas informações serão exibidas no seu perfil.
                                </span>

                                <Separator className="mt-6" />
                            </div>

                            <div className="flex flex-col">
                                <Label htmlFor="config-profile-name">Nome*</Label>
                                <Input
                                    {...register("name")}
                                    id="config-profile-name"
                                    name="name"
                                    type="text"
                                    maxLength={100}
                                    placeholder="Nome"
                                    className={`${
                                        errors.name ? "border-destructive" : ""
                                    } mt-2 w-2/3 lg:w-1/2`}
                                />
                                {errors.name && (
                                    <span className="mt-1 text-xs font-medium text-destructive">
                                        {errors.name.message}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <Label htmlFor="config-profile-username">Usuário*</Label>
                                <div className="relative mt-2 flex w-2/3 lg:w-1/4">
                                    <Input
                                        {...register("username")}
                                        id="config-profile-username"
                                        name="username"
                                        type="text"
                                        maxLength={50}
                                        placeholder="usuario"
                                        className={`${
                                            isInvalidUsername ? "border-destructive" : ""
                                        } w-full pr-9`}
                                        onBlur={verifyUsername}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {isValidatingUsername ? (
                                            <Loader2
                                                size={16}
                                                className="animate-spin text-muted-foreground"
                                            />
                                        ) : isInvalidUsername ? (
                                            <XCircle size={16} className="text-destructive" />
                                        ) : (
                                            <CheckCircle2 size={16} className="text-green-500" />
                                        )}
                                    </div>
                                </div>
                                {isInvalidUsername && (
                                    <span className="mt-1 text-xs font-medium text-destructive">
                                        {!typedUsername
                                            ? "Campo obrigatório."
                                            : containsInvalidChars
                                            ? "Contém caracteres inválidos."
                                            : usernameAlreadyExists
                                            ? "O nome de usuário já existe."
                                            : errors.username
                                            ? errors.username.message
                                            : ""}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <Label htmlFor="config-profile-email">E-mail*</Label>
                                <Input
                                    {...register("email")}
                                    id="config-profile-email"
                                    name="email"
                                    type="text"
                                    disabled
                                    placeholder="exemplo@email.com"
                                    className={`${
                                        errors.email ? "border-destructive" : ""
                                    } mt-2 w-2/3 lg:w-1/3`}
                                />
                                <span className="mt-1 text-xs text-muted-foreground">
                                    Não é possível alterar o e-mail no momento.
                                </span>
                                {errors.email && (
                                    <span className="mt-1 text-xs font-medium text-destructive">
                                        {errors.email.message}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <Label htmlFor="config-profile-image">Foto de perfil</Label>
                                <div className="mt-2 flex items-center gap-2">
                                    <Controller
                                        name="image"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Avatar className="h-24 w-24">
                                                    <AvatarImage
                                                        src={
                                                            selectedImage?.[0]
                                                                ? URL.createObjectURL(
                                                                      selectedImage[0],
                                                                  )
                                                                : user.imageUrl
                                                        }
                                                        width={96}
                                                        height={96}
                                                        loading="eager"
                                                        alt={`Foto de perfil de ${user.username}`}
                                                        title={`Foto de perfil de ${user.username}`}
                                                    />
                                                    <AvatarFallback>
                                                        {user.username[0].toUpperCase() || "-"}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="outline"
                                                    type="button"
                                                >
                                                    <Label
                                                        htmlFor="config-profile-image"
                                                        className="cursor-pointer"
                                                    >
                                                        Alterar foto
                                                    </Label>
                                                </Button>

                                                <Input
                                                    {...register("image")}
                                                    id="config-profile-image"
                                                    name="image"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        field.onChange(e.target.files);
                                                        setIsOpenImageCropDialog(true);
                                                    }}
                                                />

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
                                            </>
                                        )}
                                    ></Controller>
                                    {errors.image && (
                                        <span className="mt-1 text-xs font-medium text-destructive">
                                            {`${errors.image.message}`}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <Label htmlFor="config-profile-description">Descrição</Label>
                                <Textarea
                                    {...register("description")}
                                    name="description"
                                    id="config-profile-description"
                                    rows={4}
                                    maxLength={600}
                                    placeholder="Uma breve descrição sobre você."
                                    className="mt-2"
                                ></Textarea>
                                {errors.description && (
                                    <span className="mt-1 text-xs font-medium text-destructive">
                                        {errors.description.message}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                <div className="flex w-full flex-col md:w-1/2">
                                    <Label htmlFor="config-profile-location">Localização</Label>
                                    <Input
                                        {...register("location")}
                                        id="config-profile-location"
                                        name="location"
                                        type="text"
                                        maxLength={50}
                                        placeholder="Brasil"
                                        className={`${
                                            errors.location ? "border-destructive" : ""
                                        } mt-2 w-full`}
                                    />
                                    {errors.location && (
                                        <span className="mt-1 text-xs font-medium text-destructive">
                                            {errors.location.message}
                                        </span>
                                    )}
                                </div>

                                <div className="flex w-full flex-col md:w-1/2">
                                    <Label htmlFor="config-profile-website">Site</Label>
                                    <Input
                                        {...register("website")}
                                        id="config-profile-website"
                                        name="website"
                                        type="text"
                                        placeholder="https://www.exemplo.com"
                                        className={`${
                                            errors.website ? "border-destructive" : ""
                                        } mt-2 w-full`}
                                    />
                                    {errors.website && (
                                        <span className="mt-1 text-xs font-medium text-destructive">
                                            {errors.website.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <Label htmlFor="config-profile-twitter">Twitter</Label>
                                <Input
                                    {...register("twitter")}
                                    id="config-profile-twitter"
                                    name="twitter"
                                    type="text"
                                    placeholder="twitter"
                                    className={`${
                                        errors.twitter ? "border-destructive" : ""
                                    } mt-2 w-2/3 lg:w-1/4`}
                                />
                            </div>

                            <Button
                                size="md"
                                variant="primary"
                                type="submit"
                                disabled={updateUserData.isLoading || isInvalidUsername}
                            >
                                {updateUserData.isLoading ? (
                                    <>
                                        <Loader2 size={22} className="animate-spin" />
                                        <span>Atualizando...</span>
                                    </>
                                ) : (
                                    <span>Atualizar perfil</span>
                                )}
                            </Button>
                        </form>
                    </>
                )}
            </section>
        </>
    );
}
