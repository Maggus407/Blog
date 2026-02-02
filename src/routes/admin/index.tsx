import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
    const session = await auth.api.getSession({
        headers: new Headers(getRequestHeaders()),
    });

    if (!session) {
        return null;
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (
        adminEmail &&
        session.user.email?.trim().toLowerCase() !== adminEmail
    ) {
        return null;
    }

    return session;
});

export const Route = createFileRoute("/admin/")({
    beforeLoad: async () => {
        const session = await getAdminSession();
        if (!session) {
            throw redirect({ to: "/" });
        }
    },
    component: AdminIndexComponent,
});

function AdminIndexComponent() {
    const editor = useEditor({
        extensions: [StarterKit],
        content: "<p>Write your blog post here...</p>",
        immediatelyRender: false,
    });

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-foreground text-lg font-semibold">Create blog post</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                    Draft your content below.
                </p>
            </div>

            <Input placeholder="Post title" />

            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    disabled={!editor?.can().chain().focus().toggleBold().run()}
                >
                    Bold
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    disabled={!editor?.can().chain().focus().toggleItalic().run()}
                >
                    Italic
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                >
                    Bullet list
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                >
                    Numbered list
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editor?.chain().focus().setParagraph().run()}
                >
                    Paragraph
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        editor?.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                >
                    H2
                </Button>
            </div>

            <div className="rounded-md border border-input bg-background px-3 py-2">
                <EditorContent
                    editor={editor}
                    className="min-h-52 text-sm [&_.ProseMirror]:min-h-48 [&_.ProseMirror]:outline-none"
                />
            </div>

            <div className="flex justify-end">
                <Button type="button">Save draft</Button>
            </div>
        </div>
    );
}
