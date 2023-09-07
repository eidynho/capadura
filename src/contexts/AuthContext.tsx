"use client";

import { createContext, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie, parseCookies } from "nookies";

import { api } from "@/lib/api";

import { ProfileDataResponse, useFetchCurrentUser } from "@/endpoints/queries/usersQueries";
import { useSignIn } from "@/endpoints/mutations/usersMutations";
import { signOut } from "@/utils/sign-out";

interface AuthContextType {
    user?: ProfileDataResponse;
    isAuthenticated: boolean;
    signIn: (data: SignInRequestProps) => void;
    isSignInLoading: boolean;
    isOpenAuthDialog: boolean;
    toggleAuthDialog: (isOpen: boolean) => void;
}

export interface SignInRequestProps {
    email: string;
    password: string;
    onSuccess?: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderProps) {
    const [isOpenAuthDialog, setIsOpenAuthDialog] = useState(false);

    const router = useRouter();

    const { token } = parseCookies();

    const { data: user, isError } = useFetchCurrentUser({
        enabled: !!token,
    });

    const isAuthenticated = !!user;

    if (isError) {
        signOut();
    }

    const signInUser = useSignIn();
    const isSignInLoading = signInUser.isLoading;
    function signIn({ email, password, onSuccess }: SignInRequestProps) {
        signInUser.mutate(
            {
                email,
                password,
            },
            {
                onSuccess: (data) => {
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

                    if (onSuccess) {
                        onSuccess();
                    } else {
                        router.push("/livros");
                    }
                },
            },
        );
    }

    function toggleAuthDialog(isOpen: boolean) {
        setIsOpenAuthDialog(isOpen);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                signIn,
                isSignInLoading,
                isOpenAuthDialog,
                toggleAuthDialog,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
