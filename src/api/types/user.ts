export interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
  createdAt: string;
  isDeleted: boolean;
}

export interface MeResponse {
  id: string;
  name: string;
  bio: string | null;
  email: string;
  role: string;
  isEmailVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
}

export interface UpdateProfileRequest {
  name?: string | null;
  bio?: string | null;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UserStatsDto {
  enrolledCoursesCount: number;
  completedCoursesCount: number;
  inProgressCoursesCount: number;
  totalScore: number;
  createdCoursesCount: number;
  publishedCoursesCount: number;
  totalStudentsCount: number;
  averageRating: number;
}