export type TaskType = "SingleChoice" | "MultiChoice" | "TextInput";

export interface TaskStudentDto {
    id: string;
    lessonId: string;
    type: TaskType;
    question: string;
    options?: string[] | null;
    hints?: string[] | null;
    points: number;
    orderIndex: number;
    isRequired: boolean;
}

export interface SubmitTaskRequest {
    answerIndex?: number | null;
    answerIndexes?: number[] | null;
    answerText?: string | null;
}

export interface TaskSubmissionDto {
    id: string;
    taskId: string;
    userId: string;
    answerIndex?: number | null;
    answerIndexes?: number[] | null;
    answerText?: string | null;
    isCorrect?: boolean | null;
    score: number;
    attemptNumber: number;
    submittedAt: string;
}