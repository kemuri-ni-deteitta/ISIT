import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor for future auth tokens
apiClient.interceptors.request.use(
	(config) => {
		// TODO: Add auth token from localStorage
		// const token = localStorage.getItem('token');
		// if (token) {
		//   config.headers.Authorization = `Bearer ${token}`;
		// }
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error('API Error:', error);
		return Promise.reject(error);
	}
);

