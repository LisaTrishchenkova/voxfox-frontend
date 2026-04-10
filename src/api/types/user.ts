export interface UserResponse {
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface MeResponse {
  id: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
}