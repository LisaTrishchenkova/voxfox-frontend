import type {CourseDto} from "./course.ts";

export type EnrollmentStatus = "Active" | "Completed" | "Cancelled";

export interface EnrollmentDto {
    id: string;
    userId: string;
    courseId: string;
    status: EnrollmentStatus;
    progressPercent: number;
    enrolledAt: string;
    completedAt?: string | null;
    course: CourseDto;
}