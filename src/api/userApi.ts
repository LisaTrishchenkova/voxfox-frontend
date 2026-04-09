import { authStorage } from "../services/auth-storage.service";

import type { MeResponse, UserResponse } from "./types/user";
import {API_URL} from "../config.ts";

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
};