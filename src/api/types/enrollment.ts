import type { CourseDto } from "./course.ts";
import type { NewAchievement } from "../../components/AchievementPopup.tsx";

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
    newAchievements?: NewAchievement[] | null;
}

export type NotificationType =
    | "CourseApproved"
    | "CourseRejected"
    | "NewQuestion"
    | "QuestionAnswered"
    | "CertificateIssued";

export interface NotificationDto {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    relatedEntityId: string | null;
    relatedCourseId: string | null;
    createdAt: string;
}