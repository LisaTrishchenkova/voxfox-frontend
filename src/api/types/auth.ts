export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  tokenRefresh: string;
  tokenAccess: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export type UserRole = "Student" | "Teacher";

export interface RegistrationRequest {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}
export interface RegistrationResponse {
  userId: string;
  tokenRefresh: string;
  tokenAccess: string;
}
export interface RegistrationFormData {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}
