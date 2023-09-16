import { useAuthContext } from "@/contexts/AuthContext";

export function isPageUserSameCurrentUser(username: string) {
    const { user } = useAuthContext();

    if (!user) return false;

    return user.username === username;
}
