export type SaveDraftPayload = {
    title: string;
    contentHtml: string;
};

export type SaveDraftResult = {
    id: string;
    updatedAt: string | null;
};

export type AdminDraftListItem = {
    id: string;
    title: string;
    createdAt: string | null;
};

export type AdminDraftListResponse = {
    page: number;
    totalPages: number;
    totalPosts: number;
    posts: AdminDraftListItem[];
};
