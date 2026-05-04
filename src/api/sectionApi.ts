import { authStorage } from "../services/auth-storage.service";
import { API_URL } from "../config";
import type { SectionDto } from "./types/course";

export interface CreateSectionDto {
    title: string;
    description: string;
}

export const sectionApi = {
    getSectionById: async (id: string): Promise<SectionDto | null> => {
        try {
            const res = await fetch(`${API_URL}/Sections/${id}`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return null;
            return res.json();
        } catch {
            return null;
        }
    },

    getLessonsBySection: async (sectionId: string) => {
        try {
            const res = await fetch(`${API_URL}/Sections/${sectionId}/lessons`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return [];
            return res.json();
        } catch {
            return [];
        }
    },

    createSection: async (courseId: string, data: CreateSectionDto): Promise<SectionDto | null> => {
        try {
            const res = await fetch(`${API_URL}/Sections?courseId=${courseId}`, {
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

    updateSection: async (id: string, data: Partial<CreateSectionDto>): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/Sections/${id}`, {
                method: "PUT",
                headers: authStorage.getAuthHeaders(),
                body: JSON.stringify(data),
            });
            return res.ok;
        } catch {
            return false;
        }
    },

    deleteSection: async (id: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/Sections/${id}`, {
                method: "DELETE",
                headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch {
            return false;
        }
    },
};