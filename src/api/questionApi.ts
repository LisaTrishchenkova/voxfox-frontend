import { authStorage } from "../services/auth-storage.service";
import { API_URL } from "../config";
import type { QuestionDto, CreateQuestionDto, AnswerQuestionDto } from "./types/question";

export const questionApi = {
    getLessonQuestions: async (lessonId: string): Promise<QuestionDto[]> => {
        try {
            const res = await fetch(`${API_URL}/Lessons/${lessonId}/questions`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return [];
            return res.json();
        } catch {
            return [];
        }
    },

    createQuestion: async (lessonId: string, data: CreateQuestionDto): Promise<QuestionDto | null> => {
        try {
            const res = await fetch(`${API_URL}/Lessons/${lessonId}/questions`, {
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

    answerQuestion: async (questionId: string, data: AnswerQuestionDto): Promise<QuestionDto | null> => {
        try {
            const res = await fetch(`${API_URL}/questions/${questionId}/answer`, {
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

    deleteQuestion: async (questionId: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/questions/${questionId}`, {
                method: "DELETE",
                headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch {
            return false;
        }
    },
};