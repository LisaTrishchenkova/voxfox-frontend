import { authStorage } from "../services/auth-storage.service";
import { API_URL } from "../config";
import type {
  CourseDto,
  CreateCourseDto,
  PaginatedResponse,
  CourseLevel,
  CourseStatus,
} from "./types/course";

export interface CourseSearchParams {
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  categoryId?: string;
  sortBy?: "Relevance" | "Title" | "Date" | "DateDesc" | "Price" | "Popular";
  level?: CourseLevel;
  minPrice?: number;
  maxPrice?: number;
  isFree?: boolean;
}

export const courseApi = {
  getCourses: async (params: CourseSearchParams = {}): Promise<PaginatedResponse | null> => {
    try {
      const p = new URLSearchParams();
      if (params.searchTerm) p.append("searchTerm", params.searchTerm);
      if (params.page) p.append("page", params.page.toString());
      if (params.pageSize) p.append("pageSize", params.pageSize.toString());
      if (params.sortBy) p.append("sortBy", params.sortBy);
      if (params.categoryId) p.append("categoryId", params.categoryId);
      if (params.level) p.append("level", params.level);
      if (params.minPrice != null) p.append("minPrice", params.minPrice.toString());
      if (params.maxPrice != null) p.append("maxPrice", params.maxPrice.toString());
      if (params.isFree != null) p.append("isFree", params.isFree.toString());
      const res = await fetch(`${API_URL}/Courses?${p.toString()}`);
      if (!res.ok) return null;
      return res.json();
    } catch { return null; }
  },

  getCourseById: async (id: string): Promise<CourseDto | null> => {
    try {
      const res = await fetch(`${API_URL}/Courses/${id}`);
      if (!res.ok) return null;
      return res.json();
    } catch { return null; }
  },

  getMyCourses: async (status?: CourseStatus): Promise<CourseDto[]> => {
    try {
      const p = new URLSearchParams();
      if (status) p.append("status", status);
      const res = await fetch(`${API_URL}/Courses/my?${p.toString()}`, {
        headers: authStorage.getAuthHeaders(),
      });
      if (!res.ok) return [];
      return res.json();
    } catch { return []; }
  },

  getPendingCourses: async (page = 1, pageSize = 20): Promise<PaginatedResponse | null> => {
    try {
      const res = await fetch(`${API_URL}/Courses/pending?page=${page}&pageSize=${pageSize}`, {
        headers: authStorage.getAuthHeaders(),
      });
      if (!res.ok) return null;
      return res.json();
    } catch { return null; }
  },

  createCourse: async (data: CreateCourseDto): Promise<CourseDto | null> => {
    try {
      const res = await fetch(`${API_URL}/Courses`, {
        method: "POST",
        headers: authStorage.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      return res.json();
    } catch { return null; }
  },

  updateCourse: async (id: string, data: Partial<CreateCourseDto>): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/Courses/${id}`, {
        method: "PUT",
        headers: authStorage.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return res.ok;
    } catch { return false; }
  },

  deleteCourse: async (id: string, reason?: string): Promise<boolean> => {
    try {
      const url = reason
          ? `${API_URL}/Courses/${id}?reason=${encodeURIComponent(reason)}`
          : `${API_URL}/Courses/${id}`;
      const authHeaders = authStorage.getAuthHeaders() as Record<string, string>;
      const { "Content-Type": _, ...headersWithoutContentType } = authHeaders;
      const res = await fetch(url, {
        method: "DELETE",
        headers: headersWithoutContentType,
      });
      return res.ok;
    } catch { return false; }
  },

  restoreCourse: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/Courses/${id}/restore`, {
        method: "PUT",
        headers: authStorage.getAuthHeaders(),
      });
      return res.ok;
    } catch { return false; }
  },

  submitForModeration: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/Courses/${id}/moderate`, {
        method: "PUT",
        headers: authStorage.getAuthHeaders(),
      });
      return res.ok;
    } catch { return false; }
  },

  approveCourse: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/Courses/${id}/approve`, {
        method: "PUT",
        headers: authStorage.getAuthHeaders(),
      });
      return res.ok;
    } catch { return false; }
  },

  rejectCourse: async (id: string, reason?: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/Courses/${id}/reject`, {
        method: "PUT",
        headers: authStorage.getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });
      return res.ok;
    } catch { return false; }
  },

  getSections: async (courseId: string) => {
    try {
      const res = await fetch(`${API_URL}/Courses/${courseId}/sections`);
      if (!res.ok) return [];
      return res.json();
    } catch { return []; }
  },

  getCourseEnrollments: async (courseId: string) => {
    try {
      const res = await fetch(`${API_URL}/Courses/${courseId}/enrollments`, {
        headers: authStorage.getAuthHeaders(),
      });
      if (!res.ok) return [];
      return res.json();
    } catch { return []; }
  },
};