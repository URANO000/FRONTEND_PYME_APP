import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - Add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // This handles errors that happen BEFORE the request is sent
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors from the server
api.interceptors.response.use(
    (response) => {
        // If response is successful, just return it
        return response;
    },
    (error) => {
        // This handles errors from the server response
        if (error.response?.status === 500) {
            window.location.href = '/500';
        }
        if (error.response?.status === 401) {
            // Unauthorized - token might be invalid/expired
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        if (error.response?.status === 403) {
            // Forbidden - user doesn't have permission
            window.location.href = '/403';
        }
        return Promise.reject(error);
    }
);

export default api;