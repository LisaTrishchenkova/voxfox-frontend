import { storage } from "./storage.service";

/**
 * Сервис для работы с данными авторизации
 */
class AuthStorageService {
  private readonly ACCESS_TOKEN_KEY = "tokenAccess";
  private readonly REFRESH_TOKEN_KEY = "tokenRefresh";
  private readonly USER_DATA_KEY = "userData";

  // Access token
  getAccessToken(): string | null {
    return storage.getString(this.ACCESS_TOKEN_KEY);
  }

  setAccessToken(token: string): void {
    storage.setString(this.ACCESS_TOKEN_KEY, token);
  }

  removeAccessToken(): void {
    storage.remove(this.ACCESS_TOKEN_KEY);
  }

  // Refresh token
  getRefreshToken(): string | null {
    return storage.getString(this.REFRESH_TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    storage.setString(this.REFRESH_TOKEN_KEY, token);
  }

  removeRefreshToken(): void {
    storage.remove(this.REFRESH_TOKEN_KEY);
  }

  // User data
  getUserData<T>(): T | null {
    return storage.get<T>(this.USER_DATA_KEY);
  }

  setUserData<T>(userData: T): void {
    storage.set<T>(this.USER_DATA_KEY, userData);
  }

  removeUserData(): void {
    storage.remove(this.USER_DATA_KEY);
  }

  // Общие методы
  clearAllAuthData(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUserData();
  }

  hasToken(): boolean {
    return !!this.getAccessToken();
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  /**
   * Получить заголовки авторизации
   */
  getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Получить заголовки авторизации для загрузки файлов (без Content-Type)
   */
  getAuthHeadersForFileUpload(): Record<string, string> {
    const token = this.getAccessToken();
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Получить заголовки авторизации для запросов с кастомным Content-Type
   */
  getAuthHeadersWithContentType(contentType: string): Record<string, string> {
    const token = this.getAccessToken();
    return {
      "Content-Type": contentType,
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }
}

// Экспортируем синглтон
export const authStorage = new AuthStorageService();
