import axios from "axios";
import type { LoginRequest, LoginResponse } from "./types/auth";

const BASE_URL = "http://localhost:5000/api";

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const requestData: LoginRequest = { email, password };

    const response = await axios.post<LoginResponse>(`${BASE_URL}/Auth/login`, requestData);
    return response.data
  },
};
