import { apiClient } from './client';
import type { Department, Category } from '../types/expense';

export const referenceApi = {
	getDepartments: async (): Promise<Department[]> => {
		const response = await apiClient.get<Department[]>('/api/v1/departments');
		return response.data;
	},

	getCategories: async (): Promise<Category[]> => {
		const response = await apiClient.get<Category[]>('/api/v1/categories');
		return response.data;
	},
};

