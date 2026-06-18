import { authStorage } from "../services/auth-storage.service";
import { API_URL } from "../config";

// ─── DTO types ───────────────────────────────────────────────

export interface DraftTaskDto {
    id: string;
    originalTaskId?: string;
    type: string;
    question: string;
    options?: string[];
    correctIndex?: number;
    correctIndexes?: number[];
    correctAnswer?: string;
    explanation?: string;
    points: number;
    isRequired: boolean;
    orderIndex: number;
}

export interface DraftLessonDto {
    id: string;
    originalLessonId?: string;
    title: string;
    description: string;
    content?: string;
    orderIndex: number;
    tasks: DraftTaskDto[];
}

export interface DraftSectionDto {
    id: string;
    originalSectionId?: string;
    title: string;
    description: string;
    orderIndex: number;
    lessons: DraftLessonDto[];
}

export interface CourseDraftDto {
    id: string;
    courseId: string;
    title: string;
    description: string;
    fullDescription?: string;
    coverImageUrl?: string;
    price: number;
    level: string;
    certificateEnabled: boolean;
    categoryId?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    // Модератор который взял черновик на проверку
    reviewerId?: string | null;
    reviewerName?: string | null;
    reviewStartedAt?: string | null;
    sections: DraftSectionDto[];
    tags: string[];
}

// ─── Create DTO types ────────────────────────────────────────

export interface CreateDraftTaskDto {
    originalTaskId?: string;
    type: string;
    question: string;
    options?: string[];
    correctIndex?: number;
    correctIndexes?: number[];
    correctAnswer?: string;
    explanation?: string;
    points: number;
    isRequired: boolean;
    orderIndex: number;
}

export interface CreateDraftLessonDto {
    originalLessonId?: string;
    title: string;
    description: string;
    content?: string;
    orderIndex: number;
    tasks: CreateDraftTaskDto[];
}

export interface CreateDraftSectionDto {
    originalSectionId?: string;
    title: string;
    description: string;
    orderIndex: number;
    lessons: CreateDraftLessonDto[];
}

export interface CreateCourseDraftDto {
    title: string;
    description: string;
    fullDescription?: string;
    coverImageUrl?: string;
    price: number;
    level: string;
    certificateEnabled: boolean;
    categoryId?: string;
    tags: string[];
    sections: CreateDraftSectionDto[];
}

export function draftToCreateDto(draft: CourseDraftDto): CreateCourseDraftDto {
    return {
        title: draft.title,
        description: draft.description,
        fullDescription: draft.fullDescription,
        coverImageUrl: draft.coverImageUrl,
        price: draft.price,
        level: draft.level,
        certificateEnabled: draft.certificateEnabled,
        categoryId: draft.categoryId,
        tags: draft.tags,
        sections: draft.sections.map((s) => ({
            originalSectionId: s.originalSectionId,
            title: s.title,
            description: s.description,
            orderIndex: s.orderIndex,
            lessons: s.lessons.map((l) => ({
                originalLessonId: l.originalLessonId,
                title: l.title,
                description: l.description,
                content: l.content,
                orderIndex: l.orderIndex,
                tasks: l.tasks.map((t) => ({
                    originalTaskId: t.originalTaskId,
                    type: t.type,
                    question: t.question,
                    options: t.options,
                    correctIndex: t.correctIndex,
                    correctIndexes: t.correctIndexes,
                    correctAnswer: t.correctAnswer,
                    explanation: t.explanation,
                    points: t.points,
                    isRequired: t.isRequired,
                    orderIndex: t.orderIndex,
                })),
            })),
        })),
    };
}

// ─── API ─────────────────────────────────────────────────────

export const courseDraftApi = {
    getDraft: async (courseId: string): Promise<CourseDraftDto | null> => {
        try {
            const res = await fetch(`${API_URL}/courses/${courseId}/draft`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return null;
            return res.json();
        } catch { return null; }
    },

    updateDraftFull: async (courseId: string, draftId: string, data: CreateCourseDraftDto): Promise<CourseDraftDto | null> => {
        try {
            const res = await fetch(`${API_URL}/courses/${courseId}/draft/${draftId}`, {
                method: "PUT",
                headers: authStorage.getAuthHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) return null;
            return res.json();
        } catch { return null; }
    },

    submitDraft: async (courseId: string, draftId: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/courses/${courseId}/draft/${draftId}/submit`, {
                method: "POST",
                headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch { return false; }
    },

    deleteDraft: async (courseId: string, draftId: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/courses/${courseId}/draft/${draftId}`, {
                method: "DELETE",
                headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch { return false; }
    },

    getOrCreateDraft: async (courseId: string): Promise<CourseDraftDto | null> => {
        try {
            const existing = await courseDraftApi.getDraft(courseId);
            if (existing) return existing;

            const createRes = await fetch(`${API_URL}/courses/${courseId}/draft`, {
                method: "POST",
                headers: authStorage.getAuthHeaders(),
            });

            if (createRes.status === 409) return courseDraftApi.getDraft(courseId);
            if (!createRes.ok) return null;

            try { return await createRes.json(); }
            catch { return courseDraftApi.getDraft(courseId); }
        } catch { return null; }
    },

    // Модератор берёт черновик на проверку
    claimDraft: async (draftId: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/moderation/drafts/${draftId}/claim`, {
                method: "POST",
                headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch { return false; }
    },

    // Модератор освобождает черновик
    releaseDraft: async (draftId: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/moderation/drafts/${draftId}/release`, {
                method: "POST",
                headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch { return false; }
    },
};