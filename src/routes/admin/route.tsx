import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
    component: AdminLayoutComponent,
});

function AdminLayoutComponent() {
    const { data: session, isPending, error } = authClient.useSession();

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
        <div className="container mx-auto max-w-6xl py-8">
            <Outlet />
        </div>
    );
}
