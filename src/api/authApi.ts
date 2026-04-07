import axios from "axios";
import type {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
} from "./types/auth";
import { authStorage } from "../services/auth-storage.service";
import {API_URL} from "../config.ts";


export const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<LoginResponse | null> => {
    const requestData: LoginRequest = { email, password };

    try {
      console.log(API_URL);
      const response = await axios.post<LoginResponse>(
        `${API_URL}/Auth/login`,
        requestData
      );

      const responseData = response.data;
      // Сохраняем токен после успешного входа
      if (responseData.tokenAccess) {
        authStorage.setAccessToken(responseData.tokenAccess);
        authStorage.setUserData(responseData.userId);
        // Если в ответе есть refresh token, сохраняем его
        if (responseData.tokenRefresh) {
          authStorage.setRefreshToken(responseData.tokenRefresh);
        }

        console.log("Токен успешно сохранен в localStorage");
      }

      return responseData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          console.log("Неверная почта или пароль");
        } else {
          console.error(error.response);
        }
      }
      console.error(error);
      return null;
    }
  },
  registration: async (
    email: string,
    name: string,
    password: string
  ): Promise<number> => {
    const requestData: RegistrationRequest = { email, name, password };

    const response = await axios.post(
      `${API_URL}/Auth/registration`,
      requestData
    );
    return response.status;
  },
};
