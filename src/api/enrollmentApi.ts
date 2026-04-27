import { authStorage } from "../services/auth-storage.service";
import { API_URL } from "../config";
import type { EnrollmentDto } from "./types/enrollment";

export const enrollmentApi = {
    getMyEnrollments: async (): Promise<EnrollmentDto[]> => {
        try {
            const res = await fetch(`${API_URL}/Enrollments`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return [];
            return res.json();
        } catch {
            return [];
        }
    },

    enroll: async (courseId: string): Promise<EnrollmentDto | null> => {
        try {
            const res = await fetch(`${API_URL}/Enrollments`, {
                method: "POST",
                headers: authStorage.getAuthHeaders(),
                body: JSON.stringify({ courseId }),
            });
            if (!res.ok) return null;
            return res.json();
        } catch {
            return null;
        }
    },

    cancelEnrollment: async (enrollmentId: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/Enrollments/${enrollmentId}`, {
                method: "DELETE",
                headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch {
            return false;
        }
    },
};