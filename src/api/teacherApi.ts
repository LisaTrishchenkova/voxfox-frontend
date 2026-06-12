import { authStorage } from "../services/auth-storage.service";
import { API_URL } from "../config";
import type { TeacherStatsDto, TeacherCourseStatsDto } from "./types/teacher";

export const teacherApi = {
    getStats: async (): Promise<TeacherStatsDto | null> => {
        try {
            const res = await fetch(`${API_URL}/teacher/stats`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return null;
            return res.json();
        } catch {
            return null;
        }
    },

    getCourseStats: async (): Promise<TeacherCourseStatsDto[]> => {
        try {
            const res = await fetch(`${API_URL}/teacher/courses/stats`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return [];
            return res.json();
        } catch {
            return [];
        }
    },
};