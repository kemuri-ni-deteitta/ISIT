import type { Department, Category } from "@/shared/types/expense";
import { apiClient } from "./client";

export interface CreateCategoryRequest {
  code?: string;
  name: string;
  parent_id?: string;
  active?: boolean;
}

export interface UpdateCategoryRequest {
  code?: string;
  name?: string;
  parent_id?: string | null;
  active?: boolean;
}

export const referenceApi = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await apiClient.get<Department[]>("/api/v1/departments");
    return response.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>("/api/v1/categories");
    return response.data;
  },

  createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await apiClient.post<Category>("/api/v1/categories", data);
    return response.data;
  },

  updateCategory: async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await apiClient.put<Category>(`/api/v1/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/categories/${id}`);
  },
};


