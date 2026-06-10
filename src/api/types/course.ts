export interface CategoryDto {
  id: string;
  name: string;
}

export interface TagsDto {
  name: string;
}

export interface CreateCourseDto {
  title: string;
  description: string;
  fullDescription?: string | null;
  categoryId?: string | null;
  coverImageUrl?: string | null;
  price?: number;
  level?: CourseLevel;
  certificateEnabled?: boolean;
  tags?: TagsDto[] | null;
}

export interface AuthorDto {
  id: string;
  name: string;
}

export interface CourseDto {
  id: string;
  title: string;
  description: string;
  fullDescription?: string | null;
  status: CourseStatus;
  level: CourseLevel;
  coverImageUrl?: string | null;
  price: number;
  isFree: boolean;
  certificateEnabled: boolean;
  enrollmentCount: number;
  rating: number;
  durationMinutes: number;
  categoryId?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  isDeleted: boolean;
  reviewerId?: string | null;
  reviewerName?: string | null;
  reviewStartedAt?: string | null;
  reviewCount?: number;
  author: AuthorDto;
  tags?: TagsDto[] | null;
}

export interface PaginatedResponse {
  items: CourseDto[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export type CourseStatus = "Draft" | "UnderReview" | "RejectedByModerator" | "Published";
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export interface LessonDto {
  id: string;
  title: string;
  description: string;
  content?: string | null;
}

export interface SectionDto {
  id: string;
  title: string;
  description: string;
}