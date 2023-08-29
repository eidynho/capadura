import { destroyCookie } from "nookies";

export function signOut() {
    destroyCookie(undefined, "token");
    destroyCookie(undefined, "refreshToken");

    if (typeof window !== "undefined") {
        window.location.pathname = "/entrar";
    }
}
