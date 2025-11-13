import { apiClient } from "./client";

export interface DepartmentDTO {
  id: string;
  code: string;
  name: string;
  parent_id?: string | null;
  active: boolean;
}

export interface CreateDepartmentRequest {
  code?: string;
  name: string;
  parent_id?: string | null;
  active?: boolean;
}

export interface UpdateDepartmentRequest {
  code?: string;
  name?: string;
  parent_id?: string | null;
  active?: boolean;
}

export const departmentsApi = {
  list: async (): Promise<DepartmentDTO[]> => {
    const res = await apiClient.get<DepartmentDTO[]>("/api/v1/departments");
    return res.data;
  },
  create: async (data: CreateDepartmentRequest): Promise<DepartmentDTO> => {
    const res = await apiClient.post<DepartmentDTO>("/api/v1/departments", data);
    return res.data;
  },
  update: async (id: string, data: UpdateDepartmentRequest): Promise<DepartmentDTO> => {
    const res = await apiClient.put<DepartmentDTO>(`/api/v1/departments/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/departments/${id}`);
  },
};


