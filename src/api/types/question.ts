export interface QuestionDto {
    id: string;
    lessonId: string;
    authorId: string;
    authorName: string | null;
    text: string;
    answerText: string | null;
    answeredByName: string | null;
    answeredAt: string | null;
    createdAt: string;
    isAnswered: boolean;
}

export interface CreateQuestionDto {
    text: string;
}

export interface AnswerQuestionDto {
    answerText: string;
}