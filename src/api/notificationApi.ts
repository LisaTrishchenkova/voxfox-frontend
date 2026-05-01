import { authStorage } from "../services/auth-storage.service";
import { API_URL } from "../config";
import type { NotificationDto } from "./types/notification";

export const notificationApi = {
    getMyNotifications: async (): Promise<NotificationDto[]> => {
        try {
            const res = await fetch(`${API_URL}/notifications`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return [];
            return res.json();
        } catch {
            return [];
        }
    },

    getUnreadCount: async (): Promise<number> => {
        try {
            const res = await fetch(`${API_URL}/notifications/unread-count`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return 0;
            const data = await res.json();
            // бэк возвращает просто int, не { count }
            return typeof data === "number" ? data : (data.count ?? 0);
        } catch {
            return 0;
        }
    },

    markAsRead: async (notificationId: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
                method: "PUT",
                headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch {
            return false;
        }
    },

    markAllAsRead: async (): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/notifications/read-all`, {
                method: "PUT",
                headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch {
            return false;
        }
    },
};