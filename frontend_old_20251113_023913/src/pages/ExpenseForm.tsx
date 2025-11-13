import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { expensesApi } from '../api/expenses';
import { referenceApi } from '../api/reference';
import type { CreateExpenseRequest, UpdateExpenseRequest, Expense, Department, Category } from '../types/expense';

export default function ExpenseForm() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const isEdit = !!id;

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [departments, setDepartments] = useState<Department[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [formData, setFormData] = useState<CreateExpenseRequest>({
		department_id: '',
		category_id: '',
		amount: '',
		currency: 'USD',
		incurred_on: new Date().toISOString().split('T')[0],
		description: '',
	});

	useEffect(() => {
		loadReferenceData();
		if (isEdit && id) {
			loadExpense(id);
		}
	}, [isEdit, id]);

	const loadReferenceData = async () => {
		try {
			const [depts, cats] = await Promise.all([
				referenceApi.getDepartments(),
				referenceApi.getCategories(),
			]);
			setDepartments(depts);
			setCategories(cats);
		} catch (err) {
			console.error('Failed to load reference data:', err);
		}
	};

	const loadExpense = async (expenseId: string) => {
		try {
			setLoading(true);
			const expense = await expensesApi.get(expenseId);
			setFormData({
				department_id: expense.department_id,
				category_id: expense.category_id,
				amount: expense.amount,
				currency: expense.currency,
				incurred_on: expense.incurred_on,
				description: expense.description || '',
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Не удалось загрузить расход');
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			if (isEdit && id) {
				await expensesApi.update(id, formData);
			} else {
				await expensesApi.create(formData);
			}
			navigate('/expenses');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Не удалось сохранить расход');
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};


	return (
		<div style={{ fontFamily: 'Inter, system-ui, Arial', margin: 24, maxWidth: 600 }}>
			<h1>{isEdit ? 'Редактировать расход' : 'Новый расход'}</h1>

			{error && <p style={{ color: 'red', marginBottom: 16 }}>Ошибка: {error}</p>}

			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: 16 }}>
					<label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
						Подразделения *
					</label>
					<select
						name="department_id"
						value={formData.department_id}
						onChange={handleChange}
						required
						style={{ width: '100%', padding: 8, fontSize: 16 }}
					>
						<option value="">Выберите подразделение</option>
						{departments.map((dept) => (
							<option key={dept.id} value={dept.id}>
								{dept.name} ({dept.code})
							</option>
						))}
					</select>
				</div>

				<div style={{ marginBottom: 16 }}>
					<label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
						Категории *
					</label>
					<select
						name="category_id"
						value={formData.category_id}
						onChange={handleChange}
						required
						style={{ width: '100%', padding: 8, fontSize: 16 }}
					>
						<option value="">Выберите категорию</option>
						{categories.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{cat.name} ({cat.code})
							</option>
						))}
					</select>
				</div>

				<div style={{ marginBottom: 16 }}>
					<label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Сумма *</label>
					<input
						type="number"
						name="amount"
						value={formData.amount}
						onChange={handleChange}
						required
						step="0.01"
						min="0"
						style={{ width: '100%', padding: 8, fontSize: 16 }}
					/>
				</div>

				<div style={{ marginBottom: 16 }}>
					<label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Валюта</label>
					<select
						name="currency"
						value={formData.currency}
						onChange={handleChange}
						style={{ width: '100%', padding: 8, fontSize: 16 }}
					>
						<option value="USD">USD</option>
						<option value="EUR">EUR</option>
						<option value="RUB">RUB</option>
					</select>
				</div>

				<div style={{ marginBottom: 16 }}>
					<label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Дата *</label>
					<input
						type="date"
						name="incurred_on"
						value={formData.incurred_on}
						onChange={handleChange}
						required
						style={{ width: '100%', padding: 8, fontSize: 16 }}
					/>
				</div>

				<div style={{ marginBottom: 16 }}>
					<label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Описание</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						rows={4}
						style={{ width: '100%', padding: 8, fontSize: 16 }}
					/>
				</div>

				<div style={{ display: 'flex', gap: 8 }}>
					<button
						type="submit"
						disabled={loading}
						style={{
							padding: '10px 20px',
							backgroundColor: '#007bff',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: loading ? 'not-allowed' : 'pointer',
							fontSize: 16,
						}}
					>
						{loading ? 'Сохранение...' : isEdit ? 'Обновить' : 'Создать'}
					</button>
					<button
						type="button"
						onClick={() => navigate('/expenses')}
						style={{
							padding: '10px 20px',
							backgroundColor: '#6c757d',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							fontSize: 16,
						}}
					>
						Отмена
					</button>
				</div>
			</form>
		</div>
	);
}

