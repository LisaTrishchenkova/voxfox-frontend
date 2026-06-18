import { authStorage } from "../services/auth-storage.service";
import { API_URL } from "../config";
import type { TaskType } from "./types/task";

export interface TaskTeacherDto {
    id: string;
    lessonId: string;
    type: TaskType;
    question: string;
    options?: string[] | null;
    correctIndex?: number | null;
    correctIndexes?: number[] | null;
    correctAnswer?: string | null;
    explanation?: string | null;
    hints?: string[] | null;
    points: number;
    orderIndex: number;
    isRequired: boolean;
    createdAt: string;
}

export interface CreateSingleChoiceTaskDto {
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
    hints?: string[];
    points?: number;
    isRequired?: boolean;
}

export interface CreateMultiChoiceTaskDto {
    question: string;
    options: string[];
    correctIndexes: number[];
    explanation?: string;
    hints?: string[];
    points?: number;
    isRequired?: boolean;
}

export interface CreateTextInputTaskDto {
    question: string;
    correctAnswer: string;
    explanation?: string;
    hints?: string[];
    points?: number;
    isRequired?: boolean;
}

export const taskTeacherApi = {
    getLessonTasks: async (lessonId: string): Promise<TaskTeacherDto[]> => {
        try {
            const res = await fetch(`${API_URL}/lessons/${lessonId}/tasks?isTeacher=true`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return [];
            return res.json();
        } catch {
            return [];
        }
    },

    createSingleChoice: async (
        lessonId: string,
        data: CreateSingleChoiceTaskDto
    ): Promise<TaskTeacherDto | null> => {
        try {
            const res = await fetch(`${API_URL}/lessons/${lessonId}/tasks/single-choice`, {
                method: "POST",
                headers: authStorage.getAuthHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) return null;
            return res.json();
        } catch {
            return null;
        }
    },

    createMultiChoice: async (
        lessonId: string,
        data: CreateMultiChoiceTaskDto
    ): Promise<TaskTeacherDto | null> => {
        try {
            const res = await fetch(`${API_URL}/lessons/${lessonId}/tasks/multi-choice`, {
                method: "POST",
                headers: authStorage.getAuthHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) return null;
            return res.json();
        } catch {
            return null;
        }
    },

    createTextInput: async (
        lessonId: string,
        data: CreateTextInputTaskDto
    ): Promise<TaskTeacherDto | null> => {
        try {
            const res = await fetch(`${API_URL}/lessons/${lessonId}/tasks/text-input`, {
                method: "POST",
                headers: authStorage.getAuthHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) return null;
            return res.json();
        } catch {
            return null;
        }
    },

    deleteTask: async (id: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/tasks/${id}`, {
                method: "DELETE",
                headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch {
            return false;
        }
    },
};