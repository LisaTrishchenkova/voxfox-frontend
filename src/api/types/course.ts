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
  categoryId?: string | null;
  tags?: TagsDto[] | null;
}
export interface CourseDto {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  categoryId?: string | null;
  tags?: TagsDto[] | null;
}

export interface PaginatedResponse {
  items: CourseDto[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface PaginatedResponse {
  items: CourseDto[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
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
