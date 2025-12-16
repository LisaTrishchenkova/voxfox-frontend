import axios from "axios";
import type { UserResponse } from "./types/user";

const BASE_URL = "http://localhost:5000/api";

export const userApi = {
  getUserById: async (id: string): Promise<UserResponse> => {
    const response = await axios.get(`${BASE_URL}/Users/${id}`);
    return response.data;
  },
};
