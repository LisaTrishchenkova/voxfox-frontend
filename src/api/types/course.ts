export interface CourseFormData {
  title: string;
  description: string;
  shortDescription?: string; 
  category: string;
  level: string;
  imageFile?: File;
  lessonsCount: number;
  duration: string;
  format: string;
  hasCertificate: boolean;
  hasHomework: boolean;
  isPaid: boolean;
  price: number;
  discountedPrice: number;
  tags: string[];
}

export interface CourseRequest {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  level: string;
  imageUrl: string; 
  lessonsCount: number;
  duration: string;
  format: string;
  hasCertificate: boolean;
  hasHomework: boolean;
  isPaid: boolean;
  price: number;
  discountedPrice: number;
  tags: string[];
}

export interface CourseResponse {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  level: string;
  imageUrl: string;
  lessonsCount: number;
  duration: string;
  format: string;
  hasCertificate: boolean;
  hasHomework: boolean;
  isPaid: boolean;
  price: number;
  discountedPrice: number;
  tags: string[];
  status: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}