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
