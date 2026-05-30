import { authStorage } from "../services/auth-storage.service";

import {API_URL} from "../config.ts";
import type {FavoriteDto} from "./types/favorite.ts";

export const favoriteApi = {
    getMyFavorites: async (): Promise<FavoriteDto[]> => {
        const res = await fetch(`${API_URL}/favorites`, {
            headers: authStorage.getAuthHeaders(),
        });
        if (!res.ok) return [];
        return res.json();
    },

    add: async (courseId: string): Promise<FavoriteDto | null> => {
        const res = await fetch(`${API_URL}/favorites`, {
            method: "POST",
            headers: authStorage.getAuthHeaders(),
            body: JSON.stringify({ courseId }),
        });
        if (!res.ok) return null;
        return res.json();
    },

    remove: async (courseId: string): Promise<boolean> => {
        const res = await fetch(`${API_URL}/favorites/${courseId}`, {
            method: "DELETE",
            headers: authStorage.getAuthHeaders(),
        });
        return res.ok;
    },
};