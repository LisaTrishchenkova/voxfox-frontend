export interface Category {
  items: CategoryDto[];
}
export interface CategoryDto {
  id: string;
  name: string;
}

export interface Tags {
  items: TagsDto[];
}
export interface TagsDto {
  id: string;
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

export interface PaginatedResponse {
  items: CourseDto[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}
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
// export interface CourseFormData {
//   title: string;
//   description: string;
//   shortDescription?: string;
//   category: string;
//   level: string;
//   imageFile?: File;
//   lessonsCount: number;
//   duration: string;
//   format: string;
//   hasCertificate: boolean;
//   hasHomework: boolean;
//   isPaid: boolean;
//   price: number;
//   discountedPrice: number;
//   tags: string[];
// }

// export interface CourseRequest {
//   title: string;
//   description: string;
//   shortDescription: string;
//   category: string;
//   level: string;
//   imageUrl: string;
//   lessonsCount: number;
//   duration: string;
//   format: string;
//   hasCertificate: boolean;
//   hasHomework: boolean;
//   isPaid: boolean;
//   price: number;
//   discountedPrice: number;
//   tags: string[];
// }

// export interface CourseResponse {
//   id: string;
//   title: string;
//   description: string;
//   shortDescription: string;
//   category: string;
//   level: string;
//   imageUrl: string;
//   lessonsCount: number;
//   duration: string;
//   format: string;
//   hasCertificate: boolean;
//   hasHomework: boolean;
//   isPaid: boolean;
//   price: number;
//   discountedPrice: number;
//   tags: string[];
//   status: string;
//   authorId: string;
//   authorName: string;
//   createdAt: string;
//   updatedAt: string;
//   isActive: boolean;
// }
