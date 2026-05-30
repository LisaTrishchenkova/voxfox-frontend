import { authStorage } from "../services/auth-storage.service";
import { API_URL } from "../config";
import type { CertificateDto } from "./types/certificate";

export const certificateApi = {
    getMyCertificates: async (): Promise<CertificateDto[]> => {
        try {
            const res = await fetch(`${API_URL}/Users/certificates`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return [];
            return res.json();
        } catch {
            return [];
        }
    },

    getCertificateById: async (id: string): Promise<CertificateDto | null> => {
        try {
            const res = await fetch(`${API_URL}/certificates/${id}`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return null;
            return res.json();
        } catch {
            return null;
        }
    },

    downloadPdf: async (id: string, courseTitle?: string): Promise<void> => {
        try {
            const res = await fetch(`${API_URL}/certificates/${id}/download`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return;
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = courseTitle
                ? `certificate-${courseTitle.replace(/\s+/g, "_")}.pdf`
                : `certificate-${id}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            console.error("Ошибка скачивания PDF");
        }
    },

    verifyByToken: async (token: string): Promise<CertificateDto | null> => {
        try {
            const res = await fetch(`${API_URL}/certificates/verify/${token}`);
            if (!res.ok) return null;
            return res.json();
        } catch {
            return null;
        }
    },
};