import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
    component: AdminLayoutComponent,
});

function AdminLayoutComponent() {
    return <Outlet />;
}
