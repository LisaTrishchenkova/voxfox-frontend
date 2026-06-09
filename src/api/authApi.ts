import axios from "axios";
import type {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  UserRole
} from "./types/auth";
import { authStorage } from "../services/auth-storage.service";
import { API_URL } from "../config.ts";

// Тип ошибки входа — передаём на страницу логина для отображения
export type LoginError =
    | { code: "INVALID_CREDENTIALS"; message: string }
    | { code: "ACCOUNT_DELETED"; message: string }
    | { code: "ACCOUNT_BLOCKED"; message: string; reason?: string }
    | { code: "UNKNOWN"; message: string };

export type LoginResult =
    | { success: true; data: LoginResponse }
    | { success: false; error: LoginError };

export type RegistrationError =
    | { code: "EMAIL_TAKEN"; message: string }
    | { code: "ACCOUNT_DELETED"; message: string }
    | { code: "INVALID_ROLE"; message: string }
    | { code: "UNKNOWN"; message: string };

export type RegistrationResult =
    | { success: true }
    | { success: false; error: RegistrationError };

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResult> => {
    const requestData: LoginRequest = { email, password };
    try {
      const response = await axios.post<LoginResponse>(
          `${API_URL}/Auth/login`,
          requestData,
      );
      const responseData = response.data;
      if (responseData.tokenAccess) {
        authStorage.setAccessToken(responseData.tokenAccess);
        authStorage.setUserData(responseData.userId);
        if (responseData.tokenRefresh) {
          authStorage.setRefreshToken(responseData.tokenRefresh);
        }
      }
      return { success: true, data: responseData };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const body = error.response?.data;

        // 403 — удалён или заблокирован
        if (status === 403) {
          const code = body?.code;
          if (code === "ACCOUNT_DELETED") {
            return {
              success: false,
              error: { code: "ACCOUNT_DELETED", message: "Ваш аккаунт был удалён. Если вы считаете это ошибкой — свяжитесь с администратором." },
            };
          }
          if (code === "ACCOUNT_BLOCKED") {
            return {
              success: false,
              error: {
                code: "ACCOUNT_BLOCKED",
                message: "Ваш аккаунт заблокирован.",
                reason: body?.reason ?? undefined,
              },
            };
          }
        }

        // 400 — неверный пароль/email
        if (status === 400) {
          return {
            success: false,
            error: { code: "INVALID_CREDENTIALS", message: "Неверный email или пароль" },
          };
        }
      }
      return {
        success: false,
        error: { code: "UNKNOWN", message: "Произошла ошибка. Попробуйте ещё раз." },
      };
    }
  },

  registration: async (
      email: string,
      name: string,
      password: string,
      role: UserRole,
  ): Promise<RegistrationResult> => {
    const requestData: RegistrationRequest = { email, name, password, role };
    try {
      await axios.post(`${API_URL}/Auth/registration`, requestData);
      return { success: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const body = error.response?.data;

        if (status === 409 || body?.code === "EMAIL_TAKEN") {
          return { success: false, error: { code: "EMAIL_TAKEN", message: "Пользователь с таким email уже существует" } };
        }
        if (status === 403 && body?.code === "ACCOUNT_DELETED") {
          return { success: false, error: { code: "ACCOUNT_DELETED", message: "Аккаунт с этим email был удалён. Обратитесь в поддержку." } };
        }
        if (status === 400 && body?.code === "INVALID_ROLE") {
          return { success: false, error: { code: "INVALID_ROLE", message: "Недопустимая роль" } };
        }
      }
      return { success: false, error: { code: "UNKNOWN", message: "Произошла ошибка при регистрации. Попробуйте ещё раз." } };
    }
  },
};