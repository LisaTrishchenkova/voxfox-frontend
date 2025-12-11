export interface RegRequest {
  email: string;
  name: string;
  password: string;
}
export interface RegResponse {
  userId: string;
  tokenRefresh: string;
  tokenAccess: string;
}
export interface RegFormData {
  email: string;
  name: string;
  password: string;
}
