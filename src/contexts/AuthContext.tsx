"use client";

import { createContext, ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { api } from "@/lib/api";

export interface ProfileData {
    id: string;
    name: string;
    username: string;
    email: string;
    createdAt?: Date;
    description: string | null;
    location: string | null;
    website: string | null;
    twitter: string | null;
    imageKey: string | null;
    imageUrl?: string;
}

interface AuthContextType {
    user: ProfileData | null;
    isAuthenticated: boolean;
    signIn: (data: SignInRequestProps) => Promise<void>;
}

export interface SignInRequestProps {
    email: string;
    password: string;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function signOut() {
    destroyCookie(undefined, "token");
    destroyCookie(undefined, "refreshToken");

    window.location.pathname = "/entrar";
}

export function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter();

    const [user, setUser] = useState<ProfileData | null>(null);
    const isAuthenticated = !!user;

    useEffect(() => {
        const { token } = parseCookies();

        if (token) {
            const ProfileData = async () => {
                try {
                    const { data } = await api.get("/me");

                    setUser({
                        id: data.id,
                        name: data.name,
                        username: data.username,
                        email: data.email,
                        createdAt: data.createdAt,
                        description: data.description,
                        location: data.location,
                        website: data.website,
                        twitter: data.twitter,
                        imageKey: data.imageKey,
                        imageUrl: data.imageUrl,
                    });
                } catch (err) {
                    signOut();
                }
            };

            ProfileData();
        }
    }, []);

    async function signIn({ email, password }: SignInRequestProps) {
        try {
            const { data } = await api.post("/sessions", {
                email,
                password,
            });

            setCookie(undefined, "token", data.token, {
                maxAge: 60 * 60 * 24 * 10, // 10 days
                path: "/",
                secure: true, // HTTPS
                sameSite: true,
            });

            setCookie(undefined, "refreshToken", data.refreshToken, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: "/",
                secure: true, // HTTPS
                sameSite: true,
            });

            api.defaults.headers["Authorization"] = `Bearer ${data.token}`;

            setUser({
                id: data.user.id,
                name: data.user.name,
                username: data.user.username,
                email,
                createdAt: data.user.createdAt,
                description: data.user.description,
                location: data.user.location,
                website: data.user.website,
                twitter: data.user.twitter,
                imageKey: data.user.imageKey,
                imageUrl: data.user.imageUrl,
            });

            router.push("/livros");
        } catch (err) {
            throw new Error("Failed on trying to sign in: " + err);
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    );
}
