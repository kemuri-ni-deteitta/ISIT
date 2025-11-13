import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { expensesApi } from '../api/expenses';
import type { Expense } from '../types/expense';

export default function ExpenseList() {
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const pageSize = 20;

	useEffect(() => {
		loadExpenses();
	}, [page]);

	const loadExpenses = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await expensesApi.list(page, pageSize);
			setExpenses(response.expenses);
			setTotal(response.total);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Не удалось загрузить расходы');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Вы уверены, что хотите удалить этот расход?')) return;

		try {
			await expensesApi.delete(id);
			loadExpenses();
		} catch (err) {
			alert('Не удалось удалить расход');
		}
	};

	const totalPages = Math.ceil(total / pageSize);

	return (
		<div style={{ fontFamily: 'Inter, system-ui, Arial', margin: 24 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
				<h1>Расходы</h1>
				<Link
					to="/expenses/new"
					style={{
						padding: '8px 16px',
						backgroundColor: '#007bff',
						color: 'white',
						textDecoration: 'none',
						borderRadius: '4px',
					}}
				>
					+ Новый расход
				</Link>
			</div>

			{loading && <p>Загрузка расходов...</p>}
			{error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}

			{!loading && !error && (
				<>
					<div style={{ marginBottom: 16 }}>
						<strong>Всего: {total} расходов</strong>
					</div>

					<table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
						<thead>
							<tr style={{ backgroundColor: '#f5f5f5' }}>
								<th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Дата</th>
								<th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Сумма</th>
								<th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Описание</th>
								<th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Статус</th>
								<th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Действия</th>
							</tr>
						</thead>
						<tbody>
							{expenses.length === 0 ? (
								<tr>
									<td colSpan={5} style={{ padding: 24, textAlign: 'center', border: '1px solid #ddd' }}>
										Расходы не найдены. <Link to="/expenses/new">Создать</Link>
									</td>
								</tr>
							) : (
								expenses.map((expense) => (
									<tr key={expense.id}>
										<td style={{ padding: 12, border: '1px solid #ddd' }}>{expense.incurred_on}</td>
										<td style={{ padding: 12, border: '1px solid #ddd' }}>
											{expense.amount} {expense.currency}
										</td>
										<td style={{ padding: 12, border: '1px solid #ddd' }}>
											{expense.description || '-'}
										</td>
										<td style={{ padding: 12, border: '1px solid #ddd' }}>
											<span
												style={{
													padding: '4px 8px',
													borderRadius: '4px',
													backgroundColor:
														expense.status === 'approved'
															? '#d4edda'
															: expense.status === 'rejected'
															? '#f8d7da'
															: expense.status === 'paid'
															? '#cce5ff'
															: '#fff3cd',
													color:
														expense.status === 'approved'
															? '#155724'
															: expense.status === 'rejected'
															? '#721c24'
															: expense.status === 'paid'
															? '#004085'
															: '#856404',
												}}
											>
												{expense.status === 'pending' ? 'ожидает' : 
												 expense.status === 'approved' ? 'одобрено' :
												 expense.status === 'rejected' ? 'отклонено' :
												 expense.status === 'paid' ? 'оплачено' : expense.status}
											</span>
										</td>
										<td style={{ padding: 12, border: '1px solid #ddd' }}>
											<Link
												to={`/expenses/${expense.id}`}
												style={{ marginRight: 8, color: '#007bff', textDecoration: 'none' }}
											>
												Просмотр
											</Link>
											<button
												onClick={() => handleDelete(expense.id)}
												style={{
													backgroundColor: '#dc3545',
													color: 'white',
													border: 'none',
													padding: '4px 8px',
													borderRadius: '4px',
													cursor: 'pointer',
												}}
											>
												Удалить
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>

					{totalPages > 1 && (
						<div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
							<button
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page === 1}
								style={{ padding: '8px 16px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
							>
								Назад
							</button>
							<span style={{ padding: '8px 16px' }}>
								Страница {page} из {totalPages}
							</span>
							<button
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								disabled={page === totalPages}
								style={{ padding: '8px 16px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
							>
								Вперёд
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}

