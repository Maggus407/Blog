import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { desc, sql } from "drizzle-orm";
import { useCallback, useState } from "react";
import { AdminPostList } from "@/components/admin/AdminPostList";
import { AdminTipTapComposer } from "@/components/admin/AdminTipTapComposer";
import type {
    AdminDraftListResponse,
    SaveDraftPayload,
    SaveDraftResult,
} from "@/components/admin/types";
import { db } from "@/db";
import { blogPost } from "@/db/schema";
import { auth } from "@/lib/auth";

const POSTS_PER_PAGE = 10;

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

type ListDraftsInput = {
    page?: number;
};

const listDrafts = createServerFn({ method: "GET" })
    .inputValidator((input: ListDraftsInput | undefined) => {
        const parsedPage = Number(input?.page ?? 1);
        return {
            page: Number.isNaN(parsedPage)
                ? 1
                : Math.max(1, Math.trunc(parsedPage)),
        };
    })
    .handler(async ({ data }): Promise<AdminDraftListResponse> => {
        const session = await getAdminSession();
        if (!session) {
            throw new Error("Unauthorized.");
        }

        const [countRow] = await db
            .select({ count: sql<number>`count(*)` })
            .from(blogPost);

        const totalPosts = Number(countRow?.count ?? 0);
        const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
        const page = Math.min(data.page, totalPages);
        const offset = (page - 1) * POSTS_PER_PAGE;

        const posts = await db
            .select({
                id: blogPost.id,
                title: blogPost.title,
                createdAt: blogPost.createdAt,
            })
            .from(blogPost)
            .orderBy(desc(blogPost.createdAt))
            .limit(POSTS_PER_PAGE)
            .offset(offset);

        return {
            page,
            totalPages,
            totalPosts,
            posts: posts.map((post) => ({
                id: post.id,
                title: post.title,
                createdAt: post.createdAt ? post.createdAt.toISOString() : null,
            })),
        };
    });

const saveDraft = createServerFn({ method: "POST" })
    .inputValidator((input: SaveDraftPayload) => {
        const title = input.title?.trim();
        const contentHtml = input.contentHtml?.trim();

        if (!title) {
            throw new Error("Please add a title before saving.");
        }

        if (!contentHtml || contentHtml === "<p></p>") {
            throw new Error("Please add some content before saving.");
        }

        return {
            title,
            contentHtml,
        };
    })
    .handler(async ({ data }): Promise<SaveDraftResult> => {
        const session = await getAdminSession();
        if (!session) {
            throw new Error("Unauthorized.");
        }

        const [draft] = await db
            .insert(blogPost)
            .values({
                title: data.title,
                contentHtml: data.contentHtml,
                status: "draft",
                authorId: session.user.id,
            })
            .returning({
                id: blogPost.id,
                updatedAt: blogPost.updatedAt,
            });

        return {
            id: draft.id,
            updatedAt: draft.updatedAt ? draft.updatedAt.toISOString() : null,
        };
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
    const [draftRefreshKey, setDraftRefreshKey] = useState(0);

    const handleSaveDraft = useCallback(async (payload: SaveDraftPayload) => {
        return saveDraft({
            data: payload,
        });
    }, []);

    const handleListDrafts = useCallback(async (page: number) => {
        return listDrafts({
            data: { page },
        });
    }, []);

    const handleDraftSaved = useCallback(() => {
        setDraftRefreshKey((current) => current + 1);
    }, []);

    return (
        <div className="container mx-auto flex flex-row gap-4 px-4 py-8">
            <AdminTipTapComposer
                onSaveDraft={handleSaveDraft}
                onSaved={handleDraftSaved}
            />
            <AdminPostList
                loadDrafts={handleListDrafts}
                refreshKey={draftRefreshKey}
            />
        </div>
    );
}
