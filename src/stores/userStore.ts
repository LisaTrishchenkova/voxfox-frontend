import { create } from "zustand";
import type { UserResponse } from "../api/types/user";
import { userApi } from "../api/userApi";
import { authStorage } from "../services/auth-storage.service";
import { API_URL } from "../config";

interface UserStore {
    userData: UserResponse | null;
    fetchUser: () => Promise<void>;
    setAvatarUrl: (url: string) => void;
    clear: () => void;
}

export const getAvatarUrl = (url: string | null | undefined) => {
    if (!url) return null;
    const origin = new URL(API_URL).origin;
    return `${origin}${url}`;
};

export const useUserStore = create<UserStore>((set) => ({
    userData: null,

    fetchUser: async () => {
        const userId = authStorage.getUserData<string>();
        if (!userId) return;
        const user = await userApi.getUserById(userId);
        set({ userData: user });
    },

    setAvatarUrl: (url) =>
        set((state) => ({
            userData: state.userData ? { ...state.userData, avatarUrl: url } : null,
        })),

    clear: () => set({ userData: null }),
}));