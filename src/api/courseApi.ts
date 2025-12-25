import axios from "axios";
import type { CourseRequest, CourseResponse } from "./types/course";
import { authStorage } from "../services/auth-storage.service";
import { API_BASE_URL } from "./config";

export const courseApi = {
  createCourse: async (
    courseData: CourseRequest
  ): Promise<CourseResponse | null> => {
    try {
      const response = await axios.post<CourseResponse>(
        `${API_BASE_URL}/Courses`,
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
        `${API_BASE_URL}/Courses/my`,
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
  getCourseById: async (id: string): Promise<CourseResponse | null> => {
    try{
      const response = await axios.get(`${API_BASE_URL}/Courses/${id}`);
      return response.data;
    }
    catch(error){
      if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.error("Курс не найден");
      } else {
        console.error("Ошибка при получении курса:", error.response?.data);
      }
    }
    return null;
    }
  }
};
