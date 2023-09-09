"use client";

import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import lodash from "lodash";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import { AuthContext } from "@/contexts/AuthContext";
import { signOut } from "@/utils/sign-out";

import { ProfileDataResponse } from "@/endpoints/queries/usersQueries";
import { useUpdateUserData } from "@/endpoints/mutations/usersMutations";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
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
        .email({ message: "E-mail inválido" }),
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
        .union([z.literal(""), z.string().trim().url({ message: "URL inválida" })])
        .optional()
        .nullable(),
    twitter: z.string().optional().nullable(),
});

type ProfileFormSchema = z.infer<typeof profileFormSchema>;

export default function UserConfigs() {
    const { user } = useContext(AuthContext);
    if (!user) {
        return signOut();
    }

    const [userData, setUserData] = useState<ProfileDataResponse | null>(null);
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        setUserData(user);

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
        formState: { isSubmitting, errors },
        setValue,
        control,
        watch,
    } = useForm<ProfileFormSchema>({
        resolver: zodResolver(profileFormSchema),
    });

    const selectedImage = watch("image");

    const updateUserData = useUpdateUserData();
    function submitProfile(data: ProfileFormSchema) {
        if (!user) {
            return signOut();
        }

        const { id, name, username, email, image, description, location, website, twitter } = data;

        if (lodash.isEqual(userData, { ...data, createdAt: user.createdAt })) {
            toast.success("O perfil está atualizado.");
            return;
        }

        // TODO: BE ABLE TO UPDATE USERNAME AND E-MAIL (UNIQUE)
        updateUserData.mutate(
            {
                id,
                name,
                username: user.username,
                email: user.email,
                image: image[0],
                description: description ?? undefined,
                location: location ?? undefined,
                website: website ?? undefined,
                twitter: twitter ?? undefined,
            },
            {
                onSuccess: (updatedUser) => {
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

                    setUserData(updatedUser);
                    toast.success("Seu perfil foi atualizado.");
                },
            },
        );
    }

    return (
        <Container>
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
                                    placeholder="Harry J. Potter"
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
                                <Input
                                    {...register("username")}
                                    id="config-profile-username"
                                    name="username"
                                    type="text"
                                    maxLength={50}
                                    disabled
                                    placeholder="harry"
                                    className={`${
                                        errors.username ? "border-destructive" : ""
                                    } mt-2 w-2/3 lg:w-1/4`}
                                />
                                <span className="mt-1 text-xs text-muted-foreground">
                                    Não é possível alterar o usuário no momento.
                                </span>
                                {errors.username && (
                                    <span className="mt-1 text-xs font-medium text-destructive">
                                        {errors.username.message}
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
                                    placeholder="harry@email.com"
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
                                <div className="inline-block">
                                    <Label htmlFor="config-profile-image">Foto de perfil</Label>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <Controller
                                        name="image"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Avatar className="h-16 w-16">
                                                    <AvatarImage
                                                        src={
                                                            selectedImage?.[0]
                                                                ? URL.createObjectURL(
                                                                      selectedImage[0],
                                                                  )
                                                                : user.imageUrl
                                                        }
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
                                                    onChange={(e) => field.onChange(e.target.files)}
                                                />
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
                                    placeholder="Harry Potter: Bruxo corajoso, amigos leais, combate o mal, símbolo de esperança."
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
                                        placeholder="Hogwarts"
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
                                        placeholder="https://www.wizardingworld.com"
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
                                    placeholder="harrypotter"
                                    className={`${
                                        errors.twitter ? "border-destructive" : ""
                                    } mt-2 w-2/3 lg:w-1/4`}
                                />
                            </div>

                            <Button
                                size="md"
                                variant="primary"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
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
        </Container>
    );
}
