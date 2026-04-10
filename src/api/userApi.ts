import { authStorage } from "../services/auth-storage.service";
import type { MeResponse, UserResponse } from "./types/user";
import { API_URL } from "../config.ts";

export const userApi = {
  getMe: async (): Promise<MeResponse | null> => {
    const res = await fetch(`${API_URL}/Auth/me`, {
      headers: authStorage.getAuthHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  },

  getUserById: async (id: string): Promise<UserResponse | null> => {
    const res = await fetch(`${API_URL}/Users/${id}`, {
      headers: authStorage.getAuthHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string } | null> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/Users/avatar`, {
      method: "POST",
      headers: authStorage.getAuthHeadersForFileUpload(),
      body: formData,
    });
    if (!res.ok) return null;
    return res.json();
  },

  deleteAvatar: async (): Promise<boolean> => {
    const res = await fetch(`${API_URL}/Users/avatar`, {
      method: "DELETE",
      headers: authStorage.getAuthHeaders(),
    });
    return res.ok;
  },
};