export interface UserResponse {
  name: string;
  email: string;
}

export interface MeResponse {
  id: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
}