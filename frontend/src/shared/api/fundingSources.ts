import { apiClient } from "./client";

export interface FundingSource {
  id: string;
  code: string;
  name: string;
  active: boolean;
}

export interface CreateFundingSourceRequest {
  code?: string;
  name: string;
  active?: boolean;
}

export interface UpdateFundingSourceRequest {
  code?: string;
  name?: string;
  active?: boolean;
}

export const fundingSourcesApi = {
  list: async (): Promise<FundingSource[]> => {
    const res = await apiClient.get<FundingSource[]>("/api/v1/funding-sources");
    return res.data;
    },
  create: async (data: CreateFundingSourceRequest): Promise<FundingSource> => {
    const res = await apiClient.post<FundingSource>("/api/v1/funding-sources", data);
    return res.data;
  },
  update: async (id: string, data: UpdateFundingSourceRequest): Promise<FundingSource> => {
    const res = await apiClient.put<FundingSource>(`/api/v1/funding-sources/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/funding-sources/${id}`);
  },
};


