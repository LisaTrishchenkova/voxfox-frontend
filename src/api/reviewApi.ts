import { authStorage } from "../services/auth-storage.service";
import { API_URL } from "../config";
import type { ReviewDto, CreateReviewDto, UpdateReviewDto } from "./types/review";

export const reviewApi = {
    getCourseReviews: async (courseId: string): Promise<ReviewDto[]> => {
        try {
            const res = await fetch(`${API_URL}/Courses/${courseId}/reviews`);
            if (!res.ok) return [];
            return res.json();
        } catch {
            return [];
        }
    },

    createReview: async (courseId: string, data: CreateReviewDto): Promise<ReviewDto | null> => {
        try {
            const res = await fetch(`${API_URL}/Courses/${courseId}/reviews`, {
                method: "POST",
                headers: authStorage.getAuthHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) return null;
            return res.json();
        } catch {
            return null;
        }
    },

    updateReview: async (reviewId: string, data: UpdateReviewDto): Promise<ReviewDto | null> => {
        try {
            const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
                method: "PUT",
                headers: authStorage.getAuthHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) return null;
            return res.json();
        } catch {
            return null;
        }
    },

    deleteReview: async (reviewId: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
                method: "DELETE",
                headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch {
            return false;
        }
    },
};