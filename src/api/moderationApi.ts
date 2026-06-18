import { authStorage } from "../services/auth-storage.service";
import { API_URL } from "../config";
import type {CourseDto} from "./types/course.ts";

export interface CourseReviewDto {
    id: string;
    title: string;
    description: string;
    fullDescription?: string | null;
    coverImageUrl?: string | null;
    price: number;
    level: string;
    certificateEnabled: boolean;
    reviewCount: number;
    createdAt: string;
    submittedAt?: string | null;
    authorName?: string | null;
    authorId?: string | null;
    reviewerName?: string | null;
    reviewerId?: string | null;
    reviewStartedAt?: string | null;
    isClaimed: boolean;
    tags: string[];
}

export interface ModeratorStatsDto {
    moderatorId: string;
    moderatorName: string;
    totalReviewed: number;
    totalApproved: number;
    totalRejected: number;
    currentlyReviewing: number;
}

export interface AdminStatsDto {
    totalUsers: number;
    newUsersThisMonth: number;
    blockedUsers: number;
    totalCourses: number;
    publishedCourses: number;
    pendingCourses: number;
    draftCourses: number;
    totalEnrollments: number;
    completedEnrollments: number;
    totalCertificates: number;
    activeTeachers: number;
    topCoursesByEnrollments: TopCourseDto[];
}

export interface TopCourseDto {
    id: string;
    title: string;
    authorName: string;
    enrollmentCount: number;
    rating: number;
}

// ─── Moderation API ────────────────────────────────────────

export const moderationApi = {
    claimCourse: async (courseId: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/moderation/courses/${courseId}/claim`, {
                method: "POST",
                headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch { return false; }
    },

    releaseCourse: async (courseId: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/moderation/courses/${courseId}/release`, {
                method: "POST",
                headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch { return false; }
    },

    getCourseForReview: async (courseId: string): Promise<CourseReviewDto | null> => {
        try {
            const res = await fetch(`${API_URL}/moderation/courses/${courseId}`, {
                headers: authStorage.getAuthHeaders(),
                cache: "no-store",
            });
            if (!res.ok) return null;
            return res.json();
        } catch { return null; }
    },

    getMyStats: async (): Promise<ModeratorStatsDto | null> => {
        try {
            const res = await fetch(`${API_URL}/moderation/stats/my`, {
                headers: authStorage.getAuthHeaders(),
                cache: "no-store",
            });
            if (!res.ok) return null;
            return res.json();
        } catch { return null; }
    },
};

// ─── Admin API ─────────────────────────────────────────────

export const adminApi = {
    getStats: async (): Promise<AdminStatsDto | null> => {
        try {
            const res = await fetch(`${API_URL}/admin/stats`, {
                headers: authStorage.getAuthHeaders(),
                cache: "no-store",
            });
            if (!res.ok) return null;
            return res.json();
        } catch { return null; }
    },

    getModeratorsStats: async (): Promise<ModeratorStatsDto[]> => {
        try {
            const res = await fetch(`${API_URL}/admin/moderators/stats`, {
                headers: authStorage.getAuthHeaders(),
                cache: "no-store",
            });
            if (!res.ok) return [];
            return res.json();
        } catch { return []; }
    },

    blockUser: async (id: string, reason?: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/admin/users/${id}/block`, {
                method: "PUT",
                headers: authStorage.getAuthHeaders(),
                body: JSON.stringify({ reason }),
            });
            return res.ok;
        } catch { return false; }
    },

    unblockUser: async (id: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/admin/users/${id}/unblock`, {
                method: "PUT",
                headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch { return false; }
    },

    unpublishCourse: async (id: string, reason?: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/Courses/${id}/unpublish`, {
                method: "PUT",
                headers: authStorage.getAuthHeaders(),
                body: JSON.stringify({ reason: reason ?? null }),
            });
            return res.ok;
        } catch { return false; }
    },

    forceReleaseCourse: async (id: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/admin/courses/${id}/force-release`, {
                method: "PUT",
                headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch { return false; }
    },

    getAllCourses: async (): Promise<CourseDto[]> => {
        try {
            const res = await fetch(`${API_URL}/admin/courses`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return [];
            return res.json();
        } catch { return []; }
    },
};