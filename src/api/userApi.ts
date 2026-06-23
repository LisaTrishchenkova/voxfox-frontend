import { authStorage } from "../services/auth-storage.service";
import { API_URL } from "../config";
import type {
  UserResponse,
  MeResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UserStatsDto,
} from "./types/user";
import type { CourseDto } from "./types/course";
import type { CertificateDto } from "./types/certificate";

export const userApi = {
  getUserById: async (id: string): Promise<UserResponse | null> => {
    try {
      const res = await fetch(`${API_URL}/Users/${id}`, {
        headers: authStorage.getAuthHeaders(),
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },

  getMe: async (): Promise<MeResponse | null> => {
    try {
      const res = await fetch(`${API_URL}/Auth/me`, {
        headers: authStorage.getAuthHeaders(),
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/Users/profile`, {
        method: "PUT",
        headers: authStorage.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  changePassword: async (data: ChangePasswordRequest): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/Users/password`, {
        method: "PUT",
        headers: authStorage.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  getUserStats: async (id: string): Promise<UserStatsDto | null> => {
    try {
      const res = await fetch(`${API_URL}/Users/${id}/stats`);
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },

  getUserCourses: async (id: string): Promise<CourseDto[]> => {
    try {
      const res = await fetch(`${API_URL}/Users/${id}/courses`);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  },

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

  uploadImage: async (file: File): Promise<string | null> => {
    try {
      // Валидация размера (5MB как на бэкенде)
      if (file.size > 5 * 1024 * 1024) {
        console.error('Файл не должен превышать 5MB');
        return null;
      }

      const formData = new FormData();
      formData.append('file', file); // Ключ должен быть 'file' - как в бэкенде

      // БЕРЁМ заголовки без Content-Type
      const headers = authStorage.getAuthHeaders();
      // Удаляем Content-Type, если он есть
      delete headers['Content-Type'];
      // Или можно создать новый объект без Content-Type:
      // const { 'Content-Type': _, ...cleanHeaders } = headers;

      const res = await fetch(`${API_URL}/images`, {
        method: 'POST',
        headers: headers, // Content-Type НЕ устанавливаем - браузер сам добавит multipart/form-data
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Ошибка загрузки:', res.status, errorText);
        return null;
      }

      const data = await res.json();
      return data.url; // Бэкенд возвращает /api/images/{guid}
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      return null;
    }
  },

// 2. Потом сохраняем url как аватар пользователя
  uploadAvatar: async (url: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/users/avatar?url=${encodeURIComponent(url)}`, {
        method: "POST",
        headers: authStorage.getAuthHeaders(),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  handleAvatarChange: async (file: File): Promise<boolean> => {
    const url = await userApi.uploadImage(file);
    if (!url) return false;
    return await userApi.uploadAvatar(url);
  },

  // deleteAvatar: async (): Promise<boolean> => {
  //   try {
  //     const res = await fetch(`${API_URL}/Users/avatar`, {
  //       method: "DELETE",
  //       headers: authStorage.getAuthHeaders(),
  //     });
  //     return res.ok;
  //   } catch {
  //     return false;
  //   }
  // },

  // Admin only
  getAllUsers: async (params?: {
    search?: string;
    role?: string;
    includeDeleted?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<UserResponse[]> => {
    try {
      const p = new URLSearchParams();
      if (params?.search) p.append("search", params.search);
      if (params?.role) p.append("role", params.role);
      if (params?.includeDeleted != null) p.append("includeDeleted", params.includeDeleted.toString());
      if (params?.page) p.append("page", params.page.toString());
      if (params?.pageSize) p.append("pageSize", params.pageSize.toString());
      const res = await fetch(`${API_URL}/Users?${p.toString()}`, {
        headers: authStorage.getAuthHeaders(),
      });
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  },

  setUserRole: async (id: string, role: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/Users/${id}/role?role=${role}`, {
        method: "PUT",
        headers: authStorage.getAuthHeaders(),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  deleteUser: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/Users/${id}`, {
        method: "DELETE",
        headers: authStorage.getAuthHeaders(),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  restoreUser: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/Users/${id}/restore`, {
        method: "PUT",
        headers: authStorage.getAuthHeaders(),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};