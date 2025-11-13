import { apiClient } from "./client";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  status: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  email: string;
  last_name: string;
  first_name: string;
  middle_name?: string;
  role: string;
  password?: string;
}

export interface UpdateUserRequest {
  email?: string;
  last_name?: string;
  first_name?: string;
  middle_name?: string;
  role?: string;
  status?: string;
}

export const usersApi = {
  list: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>("/api/v1/users");
    return response.data;
  },

  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<User>("/api/v1/users", data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<User>(`/api/v1/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/users/${id}`);
  },
};

