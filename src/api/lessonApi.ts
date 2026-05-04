import { authStorage } from "../services/auth-storage.service";
import { API_URL } from "../config";
import type { LessonDto } from "./types/course";

export interface CreateLessonDto {
    title: string;
    description: string;
    content?: string;
}

export const lessonApi = {
    getLessonById: async (id: string): Promise<LessonDto | null> => {
        try {
            const res = await fetch(`${API_URL}/Lessons/${id}`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return null;
            return res.json();
        } catch {
            return null;
        }
    },

    createLesson: async (sectionId: string, data: CreateLessonDto): Promise<LessonDto | null> => {
        try {
            const res = await fetch(`${API_URL}/Lessons?sectionId=${sectionId}`, {
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

    updateLesson: async (id: string, data: Partial<CreateLessonDto>): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/Lessons/${id}`, {
                method: "PUT",
                headers: authStorage.getAuthHeaders(),
                body: JSON.stringify(data),
            });
            return res.ok;
        } catch {
            return false;
        }
    },

    deleteLesson: async (id: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/Lessons/${id}`, {
                method: "DELETE",
                headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch {
            return false;
        }
    },
};