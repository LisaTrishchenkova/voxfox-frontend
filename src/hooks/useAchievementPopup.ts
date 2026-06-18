import { useState, useRef } from "react";
import { authStorage } from "../services/auth-storage.service";
import type { NewAchievement } from "../components/AchievementPopup";

/**
 * Хук для показа попапа достижений из любого места приложения.
 * Хранит список уже показанных ачивок в localStorage глобально для пользователя.
 *
 * Использование:
 *   const { newAchievements, handleAchievements, clearAchievements } = useAchievementPopup();
 *   // после любого API-вызова:
 *   handleAchievements(data.newAchievements);
 *   // в JSX:
 *   {newAchievements.length > 0 && (
 *     <AchievementPopup achievements={newAchievements} onClose={clearAchievements} />
 *   )}
 */
export const useAchievementPopup = () => {
    const userId = authStorage.getUserData<string>();
    const STORAGE_KEY = `voxfox_${userId}_shown_achievements_global`;

    const shownRef = useRef<Set<string>>(
        new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[])
    );

    const [newAchievements, setNewAchievements] = useState<NewAchievement[]>([]);

    const markShown = (code: string) => {
        shownRef.current.add(code);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...shownRef.current]));
    };

    /**
     * Принимает массив ачивок из ответа сервера, фильтрует уже показанные
     * и если есть новые — показывает попап.
     */
    const handleAchievements = (achievements?: NewAchievement[] | null) => {
        if (!achievements || achievements.length === 0) return;
        const fresh = achievements.filter((a) => !shownRef.current.has(a.code));
        fresh.forEach((a) => markShown(a.code));
        if (fresh.length > 0) setNewAchievements(fresh);
    };

    const clearAchievements = () => setNewAchievements([]);

    return { newAchievements, handleAchievements, clearAchievements };
};