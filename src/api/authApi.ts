import axios from "axios";
import type {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
} from "./types/auth";

const BASE_URL = "http://localhost:5000/api";

export const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<LoginResponse | null> => {
    const requestData: LoginRequest = { email, password };

    try {
      const response = await axios.post(`${BASE_URL}/Auth/login`, requestData);
      return response.data;
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
      `${BASE_URL}/Auth/registration`,
      requestData
    );
    return response.status;
  },
};
