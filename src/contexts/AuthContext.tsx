import { createContext, ReactNode, useState, useEffect } from "react";
import Router from "next/router";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { api } from "@/lib/api";

interface UserProps {
    id: string;
    name: string;
    username: string;
    email: string;
    createdAt: Date;
    description: string | null;
    location: string | null;
    website: string | null;
    twitter: string | null;
}

interface AuthContextType {
    user: UserProps | null;
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

    Router.push("/login");
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps | null>(null);
    const isAuthenticated = !!user;

    useEffect(() => {
        const { token } = parseCookies();

        if (token) {
            const getUserData = async () => {
                try {
                    const { data } = await api.get("/me");

                    const {
                        id,
                        name,
                        username,
                        email,
                        createdAt,
                        description,
                        location,
                        website,
                        twitter,
                    } = data.user;
                    setUser({
                        id,
                        name,
                        username,
                        email,
                        createdAt,
                        description,
                        location,
                        website,
                        twitter,
                    });
                } catch (err) {
                    signOut();
                }
            };

            getUserData();
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

            const { id, name, username, createdAt, description, location, website, twitter } =
                data.user;

            setUser({
                id,
                name,
                username,
                email,
                createdAt,
                description,
                location,
                website,
                twitter,
            });

            Router.push("/books");
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
