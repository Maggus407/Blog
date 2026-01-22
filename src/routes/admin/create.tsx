import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/create')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/admin/create"!</div>
}
