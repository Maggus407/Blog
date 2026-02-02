import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
    component: AdminLayoutComponent,
});

function AdminLayoutComponent() {
    const { data: session, isPending, error } = authClient.useSession();
    const [signOutErrorMessage, setSignOutErrorMessage] = useState<string | null>(null);

    const handleSignInWithGitHub = async () => {
        try {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/admin",
            });
        } catch (signInError) {
            console.error(signInError);
        }
    };

    const handleSignOut = async () => {
        try {
            setSignOutErrorMessage(null);
            await authClient.signOut();
            window.location.href = "/";
        } catch (signOutError) {
            console.error(signOutError);
            const friendlyMessage =
                signOutError instanceof Error && signOutError.message
                    ? signOutError.message
                    : "Could not sign out. Please try again.";
            setSignOutErrorMessage(friendlyMessage);
        }
    };

    if (isPending) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <p className="text-muted-foreground text-sm">Loading session...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center p-4">
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
                    <p className="text-destructive text-sm font-medium">
                        Could not load session
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                        {error.message}
                    </p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center p-4">
                <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-sm">
                    <h1 className="text-foreground text-xl font-semibold">
                        Admin
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Sign in with your GitHub account to access the admin area.
                    </p>
                    <Button
                        type="button"
                        className="mt-4 w-full"
                        onClick={handleSignInWithGitHub}
                        aria-label="Sign in with GitHub"
                    >
                        Sign in with GitHub
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-3xl py-8">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-foreground text-xl font-semibold">Admin</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Signed in as{" "}
                            <span className="font-medium text-foreground">
                                {session.user.name ?? session.user.email}
                            </span>
                            {session.user.email && (
                                <span className="text-muted-foreground">
                                    {" "}
                                    ({session.user.email})
                                </span>
                            )}
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleSignOut}
                        aria-label="Sign out"
                    >
                        Sign out
                    </Button>
                </div>

                <div className="mt-6">
                    {signOutErrorMessage && (
                        <p
                            className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                            role="alert"
                        >
                            {signOutErrorMessage}
                        </p>
                    )}
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
