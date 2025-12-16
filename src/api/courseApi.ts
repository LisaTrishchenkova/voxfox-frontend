import axios from "axios";
import type { CourseRequest, CourseResponse } from "./types/course";
import { authStorage } from "../services/auth-storage.service";

const BASE_URL = "http://localhost:5000/api";

export const courseApi = {
  createCourse: async (
    courseData: CourseRequest
  ): Promise<CourseResponse | null> => {
    try {
      const response = await axios.post<CourseResponse>(
        `${BASE_URL}/Courses`,
        courseData,
        {
          headers: authStorage.getAuthHeaders(),
        }
      );

      if (response.status === 201) {
        return response.data;
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          console.error("Ошибка валидации данных курса:", error.response.data);
        } else if (error.response?.status === 401) {
          console.error("Не авторизован");
          authStorage.clearAllAuthData();
        } else {
          console.error("Ошибка при создании курса:", error.response?.data);
        }
      } else {
        console.error("Неизвестная ошибка:", error);
      }
      return null;
    }
  },

  getMyCourses: async (): Promise<CourseResponse[] | null> => {
    try {
      const response = await axios.get<CourseResponse[]>(
        `${BASE_URL}/Cource/my`,
        {
          headers: authStorage.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.error("Не авторизован для получения своих курсов");
        } else {
          console.error(
            "Ошибка при получении моих курсов:",
            error.response?.data
          );
        }
      } else {
        console.error("Неизвестная ошибка:", error);
      }
      return null;
    }
  },
};
