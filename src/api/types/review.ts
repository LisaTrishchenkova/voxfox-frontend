export interface ReviewDto {
    id: string;
    courseId: string;
    userId: string;
    userName: string | null;
    rating: number;
    comment: string | null;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateReviewDto {
    rating: number;
    comment?: string | null;
}

export interface UpdateReviewDto {
    rating?: number | null;
    comment?: string | null;
}