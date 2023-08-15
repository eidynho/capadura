"use client";

import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import lodash from "lodash";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import { api } from "@/lib/api";
import { AuthContext, ProfileData } from "@/contexts/AuthContext";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Title } from "@/components/Title";
import { Subtitle } from "@/components/Subtitle";
import { Separator } from "@/components/ui/Separator";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

const configTabs = ["Perfil"];

const MAX_FILE_SIZE = 1024 * 1024 * 2; // 2 MB;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const profileFormSchema = z.object({
    id: z.string(),
    name: z
        .string()
        .min(1, { message: "Campo obrigatório." })
        .max(50, { message: "Máximo 50 caracteres." }),
    username: z
        .string()
        .min(1, { message: "Campo obrigatório." })
        .max(50, { message: "Máximo 50 caracteres." }),
    email: z.string().email(),
    image: z
        .any()
        .refine((file) => {
            if (!file || file.length === 0) {
                return true;
            }

            return file[0]?.size <= MAX_FILE_SIZE;
        }, "O tamanho máximo é 2MB.")
        .refine((file) => {
            if (!file || file.length === 0) {
                return true;
            }

            return ACCEPTED_IMAGE_TYPES.includes(file[0]?.type);
        }, "Formatos permitidos: .jpg, .jpeg, .png and .webp."),
    description: z.string().optional().nullable(),
    location: z.string().max(50, { message: "Máximo 50 caracteres." }).optional().nullable(),
    website: z
        .union([z.literal(""), z.string().trim().url()])
        .optional()
        .nullable(),
    twitter: z.string().optional().nullable(),
});

type ProfileFormSchema = z.infer<typeof profileFormSchema>;

export default function Config() {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState<ProfileData | null>(null);
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        if (!user) return;

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

    async function submitProfile(data: ProfileFormSchema) {
        const { id, name, username, email, image, description, location, website, twitter } = data;

        if (lodash.isEqual(userData, { ...data, createdAt: user?.createdAt })) {
            toast.success("O perfil está atualizado.");
            return;
        }

        try {
            // TODO: BE ABLE TO UPDATE USERNAME AND E-MAIL (UNIQUE)
            const updatedUser = await api.putForm("/me", {
                id,
                name,
                username: user?.username,
                email: user?.email,
                image: image[0],
                description: description ?? undefined,
                location: location ?? undefined,
                website: website ?? undefined,
                twitter: twitter ?? undefined,
            });

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

            setUserData(updatedUser.data);
            toast.success("Seu perfil foi atualizado.");
        } catch (err) {
            toast.error("Erro ao atualizar perfil.");
        }
    }

    return (
        <Container>
            <Title>Configurações</Title>
            <Subtitle>Gerencie as configurações da sua conta.</Subtitle>

            <Separator className="my-6 bg-gray-300" />

            <section className="mt-4 flex flex-col gap-8 md:flex-row lg:gap-6 xl:gap-8">
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
                                                ? "border border-black bg-black text-white"
                                                : "border border-transparent hover:bg-black hover:bg-opacity-5"
                                        } cursor-pointer rounded-lg px-4 py-2 text-sm`}
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

                                <Separator className="mt-6 bg-gray-300" />
                            </div>

                            <div className="flex flex-col">
                                <Label htmlFor="config-profile-name">Nome*</Label>
                                <Input
                                    {...register("name")}
                                    id="config-profile-name"
                                    name="name"
                                    type="text"
                                    maxLength={50}
                                    placeholder="Harry J. Potter"
                                    className={`${
                                        errors.name ? "border-red-500" : ""
                                    } mt-2 w-2/3 lg:w-1/2`}
                                />
                                {errors.name && (
                                    <span className="mt-1 text-xs font-semibold text-red-500">
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
                                        errors.username ? "border-red-500" : ""
                                    } mt-2 w-2/3 lg:w-1/4`}
                                />
                                <span className="mt-1 text-xs text-zinc-500">
                                    Não é possível alterar o usuário no momento.
                                </span>
                                {errors.username && (
                                    <span className="mt-1 text-xs font-semibold text-red-500">
                                        Campo obrigatório
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
                                        errors.email ? "border-red-500" : ""
                                    } mt-2 w-2/3 lg:w-1/3`}
                                />
                                <span className="mt-1 text-xs text-zinc-500">
                                    Não é possível alterar o e-mail no momento.
                                </span>
                                {errors.email && (
                                    <span className="mt-1 text-xs font-semibold text-red-500">
                                        Campo obrigatório
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
                                                                : user?.imageUrl
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {user?.username[0].toUpperCase() || "-"}
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
                                        <span className="mt-1 text-xs font-semibold text-red-500">
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
                                    placeholder="Harry Potter: Bruxo corajoso, amigos leais, combate o mal, símbolo de esperança."
                                    className="mt-2 bg-white"
                                ></Textarea>
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
                                            errors.location ? "border-red-500" : ""
                                        } mt-2 w-full`}
                                    />
                                    {errors.location && (
                                        <span className="mt-1 text-xs font-semibold text-red-500">
                                            Campo obrigatório
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
                                            errors.website ? "border-red-500" : ""
                                        } mt-2 w-full`}
                                    />
                                    {errors.website && (
                                        <span className="mt-1 text-xs font-semibold text-red-500">
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
                                        errors.twitter ? "border-red-500" : ""
                                    } mt-2 w-2/3 lg:w-1/4`}
                                />
                                {errors.twitter && (
                                    <span className="mt-1 text-xs font-semibold text-red-500">
                                        Campo obrigatório
                                    </span>
                                )}
                            </div>

                            <Button size="md" variant="black" type="submit" disabled={isSubmitting}>
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
