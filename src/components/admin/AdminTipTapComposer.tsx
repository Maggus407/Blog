import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlignedImage } from "@/lib/tiptap/aligned-image";
import { cn } from "@/lib/utils";
import type { SaveDraftPayload, SaveDraftResult } from "./types";

const DEFAULT_EDITOR_CONTENT = "<p>Write your blog post here...</p>";

type AdminTipTapComposerProps = {
    onSaveDraft: (payload: SaveDraftPayload) => Promise<SaveDraftResult>;
    onSaved?: () => void;
};

export function AdminTipTapComposer({
    onSaveDraft,
    onSaved,
}: AdminTipTapComposerProps) {
    const [title, setTitle] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    const editor = useEditor({
        extensions: [StarterKit, AlignedImage],
        content: DEFAULT_EDITOR_CONTENT,
        immediatelyRender: false,
    });

    const canSave = useMemo(
        () => !!editor && !isSaving && title.trim().length > 0,
        [editor, isSaving, title],
    );

    const toolbarButtonClass = (isActive: boolean) =>
        cn(
            "border-input",
            isActive && "border-primary/70 bg-primary/10 text-primary",
        );

    const insertImage = () => {
        if (!editor) {
            return;
        }

        const src = window.prompt("Image URL");
        if (!src) {
            return;
        }

        const cleanedSource = src.trim();
        if (!cleanedSource) {
            return;
        }

        const altText = window.prompt("Alt text (optional)")?.trim() ?? "";
        editor
            .chain()
            .focus()
            .setImage({
                src: cleanedSource,
                alt: altText,
                align: "center",
            })
            .run();
    };

    const handleSaveDraft = async () => {
        if (!editor || !canSave) {
            return;
        }

        setIsSaving(true);
        setSaveFeedback(null);
        setSaveError(null);

        try {
            const savedDraft = await onSaveDraft({
                title,
                contentHtml: editor.getHTML(),
            });

            const parsedDate = savedDraft.updatedAt
                ? new Date(savedDraft.updatedAt)
                : null;
            const savedTime =
                parsedDate && !Number.isNaN(parsedDate.getTime())
                    ? parsedDate.toLocaleString()
                    : "now";
            setSaveFeedback(`Draft saved (${savedTime})`);
            onSaved?.();
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Could not save draft.";
            setSaveError(message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-foreground text-lg font-semibold">Create blog post</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                    Draft your content below.
                </p>
            </div>

            <label htmlFor="post-title" className="sr-only">
                Post title
            </label>
            <Input
                id="post-title"
                placeholder="Post title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
            />

            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={toolbarButtonClass(!!editor?.isActive("bold"))}
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    disabled={!editor?.can().chain().focus().toggleBold().run()}
                >
                    Bold
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={toolbarButtonClass(!!editor?.isActive("italic"))}
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    disabled={!editor?.can().chain().focus().toggleItalic().run()}
                >
                    Italic
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={toolbarButtonClass(!!editor?.isActive("bulletList"))}
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    disabled={!editor?.can().chain().focus().toggleBulletList().run()}
                >
                    Bullet list
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={toolbarButtonClass(!!editor?.isActive("orderedList"))}
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    disabled={!editor?.can().chain().focus().toggleOrderedList().run()}
                >
                    Numbered list
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={toolbarButtonClass(!!editor?.isActive("paragraph"))}
                    onClick={() => editor?.chain().focus().setParagraph().run()}
                    disabled={!editor?.can().chain().focus().setParagraph().run()}
                >
                    Paragraph
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={toolbarButtonClass(
                        !!editor?.isActive("heading", { level: 2 }),
                    )}
                    onClick={() =>
                        editor?.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    disabled={
                        !editor?.can().chain().focus().toggleHeading({ level: 2 }).run()
                    }
                >
                    H2
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={insertImage}
                    disabled={!editor}
                >
                    Insert image
                </Button>
            </div>

            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={toolbarButtonClass(
                        !!editor?.isActive("image", { align: "left" }),
                    )}
                    onClick={() => editor?.chain().focus().setImageAlign("left").run()}
                    disabled={!editor?.isActive("image")}
                >
                    Image left
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={toolbarButtonClass(
                        !!editor?.isActive("image", { align: "center" }),
                    )}
                    onClick={() => editor?.chain().focus().setImageAlign("center").run()}
                    disabled={!editor?.isActive("image")}
                >
                    Image center
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={toolbarButtonClass(
                        !!editor?.isActive("image", { align: "right" }),
                    )}
                    onClick={() => editor?.chain().focus().setImageAlign("right").run()}
                    disabled={!editor?.isActive("image")}
                >
                    Image right
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={toolbarButtonClass(
                        !!editor?.isActive("image", { align: "full" }),
                    )}
                    onClick={() => editor?.chain().focus().setImageAlign("full").run()}
                    disabled={!editor?.isActive("image")}
                >
                    Image full width
                </Button>
            </div>

            <div className="rounded-md border border-input bg-background px-3 py-2">
                <EditorContent
                    editor={editor}
                    className="admin-editor min-h-52 text-sm [&_.ProseMirror]:min-h-48 [&_.ProseMirror]:outline-none"
                />
            </div>

            <div className="flex items-center justify-end gap-3">
                {saveError ? <p className="text-sm text-destructive">{saveError}</p> : null}
                {saveFeedback ? (
                    <p className="text-sm text-muted-foreground">{saveFeedback}</p>
                ) : null}
                <Button type="button" onClick={handleSaveDraft} disabled={!canSave}>
                    {isSaving ? "Saving..." : "Save draft"}
                </Button>
            </div>
        </div>
    );
}
