import { createAuthClient } from "better-auth/react";

const getBaseURL = (): string => {
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_APP_URL ?? "";
};

export const authClient = createAuthClient({
    baseURL: getBaseURL(),
});

export const { useSession, signIn, signOut } = authClient;
