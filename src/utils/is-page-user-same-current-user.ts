import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export function isPageUserSameCurrentUser(username: string) {
    const { user } = useContext(AuthContext);

    if (!user) return false;

    return user.username === username;
}
