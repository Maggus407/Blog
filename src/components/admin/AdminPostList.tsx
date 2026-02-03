import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { AdminDraftListResponse } from "./types";

type AdminPostListProps = {
    loadDrafts: (page: number) => Promise<AdminDraftListResponse>;
    refreshKey?: number;
};

export function AdminPostList({ loadDrafts, refreshKey = 0 }: AdminPostListProps) {
    const [page, setPage] = useState(1);
    const [drafts, setDrafts] = useState<AdminDraftListResponse | null>(null);
    const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
    const [draftsError, setDraftsError] = useState<string | null>(null);

    const canGoPreviousPage = (drafts?.page ?? 1) > 1;
    const canGoNextPage = (drafts?.page ?? 1) < (drafts?.totalPages ?? 1);

    const paginationPages = useMemo(() => {
        if (!drafts) {
            return [];
        }

        if (drafts.totalPages <= 3) {
            return Array.from({ length: drafts.totalPages }, (_, index) => index + 1);
        }

        if (drafts.page === 1) {
            return [1, 2, 3];
        }

        if (drafts.page === drafts.totalPages) {
            return [drafts.totalPages - 2, drafts.totalPages - 1, drafts.totalPages];
        }

        return [drafts.page - 1, drafts.page, drafts.page + 1];
    }, [drafts]);

    const fetchDrafts = useCallback(
        async (targetPage: number) => {
            setIsLoadingDrafts(true);
            setDraftsError(null);

            try {
                const response = await loadDrafts(targetPage);
                setDrafts(response);

                if (response.page !== targetPage) {
                    setPage(response.page);
                }
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : "Could not load drafts.";
                setDraftsError(message);
            } finally {
                setIsLoadingDrafts(false);
            }
        },
        [loadDrafts],
    );

    useEffect(() => {
        void fetchDrafts(page);
    }, [page, refreshKey, fetchDrafts]);

    return (
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-4">
            <h3 className="text-base font-semibold">Saved blog posts</h3>
            <p className="text-muted-foreground mt-1 text-sm">
                Title and created date are shown here.
            </p>

            {draftsError ? <p className="text-destructive mt-4 text-sm">{draftsError}</p> : null}

            {!draftsError && isLoadingDrafts && !drafts ? (
                <p className="text-muted-foreground mt-4 text-sm">Loading posts...</p>
            ) : null}

            {!draftsError && drafts && drafts.posts.length === 0 ? (
                <p className="text-muted-foreground mt-4 text-sm">
                    No posts saved yet.
                </p>
            ) : null}

            {drafts?.posts.length ? (
                <ul className="mt-4 space-y-3">
                    {drafts.posts.map((post) => (
                        <li key={post.id} className="rounded-md border border-border p-3">
                            <p className="text-sm font-medium">{post.title}</p>
                            <p className="text-muted-foreground mt-1 text-xs">
                                {post.createdAt
                                    ? new Date(post.createdAt).toLocaleString()
                                    : "Unknown created date"}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : null}

            {drafts && drafts.totalPages > 1 ? (
                <div className="mt-4 flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Previous page"
                        disabled={!canGoPreviousPage}
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                    >
                        <ChevronLeft />
                    </Button>

                    {paginationPages.map((pageNumber) => (
                        <Button
                            key={pageNumber}
                            type="button"
                            variant={pageNumber === drafts.page ? "secondary" : "outline"}
                            size="sm"
                            className="h-9 min-w-9 px-3"
                            onClick={() => setPage(pageNumber)}
                        >
                            {pageNumber}
                        </Button>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Next page"
                        disabled={!canGoNextPage}
                        onClick={() =>
                            setPage((current) =>
                                Math.min(drafts.totalPages, current + 1),
                            )
                        }
                    >
                        <ChevronRight />
                    </Button>
                </div>
            ) : null}
        </div>
    );
}
