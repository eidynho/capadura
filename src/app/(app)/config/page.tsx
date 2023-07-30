"use client";

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import lodash from "lodash";
import { toast } from "react-toastify";
import { CircleNotch, User } from "phosphor-react";

import { api } from "@/lib/api";
import { AuthContext, ProfileData } from "@/contexts/AuthContext";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/Button";

const configTabs = [
    {
        name: "Meu perfil",
        icon: <User size={20} />,
    },
];

const profileFormSchema = z.object({
    id: z.string(),
    name: z
        .string()
        .min(1, { message: "Campo obrigatório." })
        .max(50, { message: "Máximo 50 caracteres." }),
    username: z
        .string()
        .min(1, { message: "Campo obrigatório." })
        .max(50, { message: "Minimo 50 caracteres." }),
    email: z.string().email(),
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
    } = useForm<ProfileFormSchema>({
        resolver: zodResolver(profileFormSchema),
    });

    async function submitProfile(data: ProfileFormSchema) {
        const { id, name, username, email, description, location, website, twitter } = data;

        if (lodash.isEqual(userData, { ...data, createdAt: user?.createdAt })) {
            toast.success("O perfil está atualizado.");
            return;
        }

        try {
            // TODO: BE ABLE TO UPDATE USERNAME AND E-MAIL (UNIQUE)
            const updatedUser = await api.put("/me", {
                id,
                name,
                username: user?.username,
                email: user?.email,
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

            setUserData(updatedUser.data.user);
            toast.success("Seu perfil foi atualizado.");
        } catch (err) {
            toast.error("Erro ao atualizar perfil.");
        }
    }

    return (
        <Container>
            {/* Book tabs */}
            <div className="border-b-2 border-gray-200">
                <ul className="-mb-px flex flex-wrap text-center text-sm font-medium text-gray-500">
                    {configTabs.map((item, index) => (
                        <li
                            key={item.name}
                            onClick={() => setCurrentTab(index)}
                            className={`${
                                currentTab === index
                                    ? "border-yellow-600 p-4 text-yellow-600"
                                    : "border-transparent hover:border-gray-300 hover:text-gray-600"
                            } flex cursor-pointer gap-2 border-b-2 p-4 `}
                        >
                            {item.icon}
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>

            <section className="mt-4 flex flex-col gap-8 md:flex-row lg:gap-12 xl:gap-16">
                {currentTab === 0 && (
                    <>
                        <div className="w-full md:w-1/4">
                            <h1 className="font-semibold">Perfil</h1>
                            <span className="text-sm">
                                Essas informações serão exibidas pulicamente, portanto tenha cuidado
                                com o que compartilha.
                            </span>
                        </div>

                        <form
                            onSubmit={handleSubmit(submitProfile)}
                            className="flex w-full flex-col gap-8 md:w-3/4"
                        >
                            <div className="flex flex-col">
                                <label
                                    htmlFor="config-profile-name"
                                    className="flex items-center gap-1 text-sm font-semibold text-black"
                                >
                                    Nome*
                                </label>
                                <input
                                    {...register("name")}
                                    id="config-profile-name"
                                    name="name"
                                    type="text"
                                    placeholder="Harry J. Potter"
                                    className={`${
                                        errors.name ? "border-red-500" : "border-black"
                                    } mt-1 w-2/3 rounded-lg border px-3 py-2 text-sm outline-none focus:border-yellow-500 focus:ring-yellow-500 lg:w-1/2`}
                                />
                                {errors.name && (
                                    <span className="mt-1 text-xs font-semibold text-red-500">
                                        {errors.name.message}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label
                                    htmlFor="config-profile-username"
                                    className="flex items-center gap-1 text-sm font-semibold text-black"
                                >
                                    Usuário*
                                </label>
                                <input
                                    {...register("username")}
                                    id="config-profile-username"
                                    name="username"
                                    type="text"
                                    disabled
                                    placeholder="harry"
                                    className={`${
                                        errors.username ? "border-red-500" : "border-black"
                                    } mt-1 w-2/3 rounded-lg border px-3 py-2 text-sm outline-none focus:border-yellow-500 focus:ring-yellow-500 lg:w-1/4`}
                                />
                                <span className="mt-1 text-xs font-semibold">
                                    Não é possível alterar o usuário no momento.
                                </span>
                                {errors.username && (
                                    <span className="mt-1 text-xs font-semibold text-red-500">
                                        Campo obrigatório
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label
                                    htmlFor="config-profile-email"
                                    className="flex items-center gap-1 text-sm font-semibold text-black"
                                >
                                    E-mail*
                                </label>
                                <input
                                    {...register("email")}
                                    id="config-profile-email"
                                    name="email"
                                    type="text"
                                    disabled
                                    placeholder="harry@email.com"
                                    className={`${
                                        errors.email ? "border-red-500" : "border-black"
                                    } mt-1 w-2/3 rounded-lg border px-3 py-2 text-sm outline-none focus:border-yellow-500 focus:ring-yellow-500 lg:w-1/3`}
                                />
                                <span className="mt-1 text-xs font-semibold">
                                    Não é possível alterar o e-mail no momento.
                                </span>
                                {errors.email && (
                                    <span className="mt-1 text-xs font-semibold text-red-500">
                                        Campo obrigatório
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label
                                    htmlFor="config-profile-description"
                                    className="flex items-center gap-1 text-sm font-semibold text-black"
                                >
                                    Descrição
                                </label>
                                <textarea
                                    {...register("description")}
                                    name="description"
                                    id="config-profile-description"
                                    rows={4}
                                    placeholder="Harry Potter: Bruxo corajoso, amigos leais, combate o mal, símbolo de esperança."
                                    className="mt-1 block w-full rounded-lg border border-black bg-white bg-opacity-60 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                                ></textarea>
                            </div>

                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                <div className="flex w-full flex-col md:w-1/2">
                                    <label
                                        htmlFor="config-profile-location"
                                        className="flex items-center gap-1 text-sm font-semibold text-black"
                                    >
                                        Localização
                                    </label>
                                    <input
                                        {...register("location")}
                                        id="config-profile-location"
                                        name="location"
                                        type="text"
                                        placeholder="Hogwarts"
                                        className={`${
                                            errors.location ? "border-red-500" : "border-black"
                                        } mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-yellow-500 focus:ring-yellow-500`}
                                    />
                                    {errors.location && (
                                        <span className="mt-1 text-xs font-semibold text-red-500">
                                            Campo obrigatório
                                        </span>
                                    )}
                                </div>

                                <div className="flex w-full flex-col md:w-1/2">
                                    <label
                                        htmlFor="config-profile-website"
                                        className="flex items-center gap-1 text-sm font-semibold text-black"
                                    >
                                        Site
                                    </label>
                                    <input
                                        {...register("website")}
                                        id="config-profile-website"
                                        name="website"
                                        type="text"
                                        placeholder="https://www.wizardingworld.com"
                                        className={`${
                                            errors.website ? "border-red-500" : "border-black"
                                        } mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-yellow-500 focus:ring-yellow-500`}
                                    />
                                    {errors.website && (
                                        <span className="mt-1 text-xs font-semibold text-red-500">
                                            {errors.website.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label
                                    htmlFor="config-profile-twitter"
                                    className="flex items-center gap-1 text-sm font-semibold text-black"
                                >
                                    Twitter
                                </label>
                                <input
                                    {...register("twitter")}
                                    id="config-profile-twitter"
                                    name="twitter"
                                    type="text"
                                    placeholder="harrypotter"
                                    className={`${
                                        errors.twitter ? "border-red-500" : "border-black"
                                    } mt-1 w-2/3 rounded-lg border px-3 py-2 text-sm outline-none focus:border-yellow-500 focus:ring-yellow-500 lg:w-1/4`}
                                />
                                {errors.twitter && (
                                    <span className="mt-1 text-xs font-semibold text-red-500">
                                        Campo obrigatório
                                    </span>
                                )}
                            </div>

                            <Button
                                size="md"
                                type="submit"
                                className="w-full bg-black text-white hover:bg-yellow-500"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <CircleNotch
                                            size={22}
                                            weight="bold"
                                            className="animate-spin"
                                        />
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
