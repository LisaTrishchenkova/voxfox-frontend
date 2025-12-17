import axios from "axios";
import type { UserResponse } from "./types/user";
import { API_BASE_URL } from "./config";

export const userApi = {
  getUserById: async (id: string): Promise<UserResponse> => {
    const response = await axios.get(`${API_BASE_URL}/Users/${id}`);
    return response.data;
  },
};
