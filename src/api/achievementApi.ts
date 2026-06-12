import { authStorage } from "../services/auth-storage.service";
import { API_URL } from "../config";

export interface AchievementDto {
    id: string;
    code: string;
    title: string;
    description: string;
    icon: string;
    earnedAt: string | null;
    isEarned: boolean;
}

export const achievementApi = {
    getMyAchievements: async (): Promise<AchievementDto[]> => {
        try {
            const res = await fetch(`${API_URL}/achievements/my`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return [];
            return res.json();
        } catch {
            return [];
        }
    },
};