"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie, parseCookies } from "nookies";

import { api } from "@/lib/api";
import { signOut } from "@/utils/sign-out";

import { ProfileDataResponse, useFetchCurrentUser } from "@/endpoints/queries/usersQueries";
import { useSignIn } from "@/endpoints/mutations/usersMutations";

interface AuthContextType {
    user?: ProfileDataResponse;
    isFetchingCurrentUser: boolean;
    isFetchedCurrentUser: boolean;
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

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderProps) {
    const [isOpenAuthDialog, setIsOpenAuthDialog] = useState(false);

    const router = useRouter();

    const { token } = parseCookies();

    const {
        data: user,
        isFetching: isFetchingCurrentUser,
        isFetched: isFetchedCurrentUser,
        isError,
    } = useFetchCurrentUser({
        enabled: !!token,
    });

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
                        router.push("/inicio");
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
                isFetchingCurrentUser,
                isFetchedCurrentUser,
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

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within a AuthContext.Provider");
    }

    return context;
}
