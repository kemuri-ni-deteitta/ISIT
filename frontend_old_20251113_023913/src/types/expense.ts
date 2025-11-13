export interface Expense {
	id: string;
	department_id: string;
	category_id: string;
	amount: string;
	currency: string;
	incurred_on: string;
	description: string | null;
	status: string;
	created_by: string;
	created_at: string;
	updated_at: string;
}

export interface CreateExpenseRequest {
	department_id: string;
	category_id: string;
	amount: string;
	currency?: string;
	incurred_on: string;
	description?: string;
}

export interface UpdateExpenseRequest {
	department_id?: string;
	category_id?: string;
	amount?: string;
	currency?: string;
	incurred_on?: string;
	description?: string;
	status?: string;
}

export interface ExpenseListResponse {
	expenses: Expense[];
	total: number;
	page: number;
	page_size: number;
}

export interface Department {
	id: string;
	code: string;
	name: string;
	parent_id: string | null;
	active: boolean;
}

export interface Category {
	id: string;
	code: string;
	name: string;
	parent_id: string | null;
	active: boolean;
}

