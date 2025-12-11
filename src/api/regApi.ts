import axios from "axios";
import type { RegRequest, RegResponse } from "./types/reg";

const BASE_URL = "http://localhost:5000/api";

export const regApi = {
  reg: async (
    email: string,
    name: string,
    password: string
  ): Promise<number> => {
    const requestData: RegRequest = { email, name, password };

    const response = await axios.post<RegResponse>(
      `${BASE_URL}/Auth/registration`,
      requestData
    );
    return response.status;
  },
};
