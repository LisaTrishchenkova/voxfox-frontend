import type { CourseDto } from "./course";

export interface FavoriteDto {
    id: string;
    courseId: string;
    createdAt: string;
    course?: CourseDto;
}