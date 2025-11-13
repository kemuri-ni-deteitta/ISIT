import { apiClient } from './client';
import type { Expense, CreateExpenseRequest, UpdateExpenseRequest, ExpenseListResponse } from '../types/expense';

export const expensesApi = {
	list: async (page = 1, pageSize = 20): Promise<ExpenseListResponse> => {
		const response = await apiClient.get<ExpenseListResponse>('/api/v1/expenses', {
			params: { page, page_size: pageSize },
		});
		return response.data;
	},

	get: async (id: string): Promise<Expense> => {
		const response = await apiClient.get<Expense>(`/api/v1/expenses/${id}`);
		return response.data;
	},

	create: async (data: CreateExpenseRequest): Promise<Expense> => {
		const response = await apiClient.post<Expense>('/api/v1/expenses', data);
		return response.data;
	},

	update: async (id: string, data: UpdateExpenseRequest): Promise<Expense> => {
		const response = await apiClient.put<Expense>(`/api/v1/expenses/${id}`, data);
		return response.data;
	},

	delete: async (id: string): Promise<void> => {
		await apiClient.delete(`/api/v1/expenses/${id}`);
	},
};

