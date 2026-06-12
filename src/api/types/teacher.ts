export interface TeacherStatsDto {
    totalStudents: number;
    publishedCourses: number;
    totalCourses: number;
    averageRating: number;
    totalEarnings: number;
    earningsThisMonth: number;
    totalCertificates: number;
    completedEnrollments: number;
}

export interface TeacherCourseStatsDto {
    courseId: string;
    title: string;
    coverImageUrl?: string | null;
    status: string;
    price: number;
    activeStudents: number;
    completedStudents: number;
    totalStudents: number;
    averageProgress: number;
    rating: number;
    reviewCount: number;
    earnings: number;
    certificatesIssued: number;
    publishedAt?: string | null;
    createdAt: string;
}



