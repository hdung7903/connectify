import axios from 'axios';
import { refreshTokenService } from './auth.service';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await refreshTokenService();
                if (response.accessToken) {
                    setAuthState(prev => ({
                        ...prev,
                        accessToken: response.accessToken
                    }));
                    localStorage.setItem('access_token', response.accessToken);

                    originalRequest.headers['Authorization'] = `Bearer ${response.accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                await handleLogout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;