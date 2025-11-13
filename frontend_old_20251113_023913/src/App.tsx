import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ExpenseList from './pages/ExpenseList';
import ExpenseForm from './pages/ExpenseForm';

export default function App() {
	return (
		<BrowserRouter>
			<div style={{ fontFamily: 'Inter, system-ui, Arial' }}>
				<nav
					style={{
						backgroundColor: '#f8f9fa',
						padding: '16px 24px',
						borderBottom: '1px solid #dee2e6',
						marginBottom: 24,
					}}
				>
					<Link
						to="/expenses"
						style={{
							marginRight: 16,
							color: '#007bff',
							textDecoration: 'none',
							fontWeight: 'bold',
						}}
					>
						Расходы
					</Link>
					<Link
						to="/expenses/new"
						style={{
							color: '#007bff',
							textDecoration: 'none',
						}}
					>
						Новый расход
					</Link>
				</nav>

				<Routes>
					<Route path="/" element={<ExpenseList />} />
					<Route path="/expenses" element={<ExpenseList />} />
					<Route path="/expenses/new" element={<ExpenseForm />} />
					<Route path="/expenses/:id" element={<ExpenseForm />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}
