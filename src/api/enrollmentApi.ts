import type {EnrollmentDto} from "./types/enrollment.ts";

import {authStorage} from "../services/auth-storage.service.ts";
import {API_URL} from "../config.ts";

export const enrollmentApi = {
  getMyEnrollments: async (): Promise<EnrollmentDto[]> => {
      const response =await fetch(`${API_URL}/Enrollments`,
          {
              headers: authStorage.getAuthHeaders(),
          });
      if(!response.ok) return [];
      return response.json();
    },
    enroll: async (courseId: string) : Promise<EnrollmentDto | null> =>{
      const response = await fetch(`${API_URL}/Enrollments`, {
          method: "POST",
          headers: authStorage.getAuthHeaders(),
          body: JSON.stringify({courseId}),
      });
      if(!response.ok) return null;
      return response.json();
    },
};