import { createContext, useContext, useEffect, useState } from 'react';
import { loginService, logoutService, meService } from '../services/auth.service';
import api from '../services/axios';

const TOKEN_CHECK_INTERVAL = 1000;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        accessToken: null,
        user: null,
        loading: true,
    });

    const updateAxiosAuth = (token) => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    };

    const isTokenExpired = (token) => {
        if (!token) return true;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch (e) {
            return true;
        }
    };

    const refreshAuth = async () => {
        try {
            const response = await refreshTokenService();
            if (response.accessToken) {
                localStorage.setItem('access_token', response.accessToken);
                updateAxiosAuth(response.accessToken);
                setAuthState(prev => ({
                    ...prev,
                    accessToken: response.accessToken,
                    isAuthenticated: true,
                }));
                return true;
            }
            return false;
        } catch (error) {
            await handleLogout();
            return false;
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');

                if (!accessToken) {
                    throw new Error('No access token available');
                }

                if (isTokenExpired(accessToken)) {
                    const refreshSuccess = await refreshAuth();
                    if (!refreshSuccess) throw new Error('Token refresh failed');
                } else {
                    updateAxiosAuth(accessToken);
                }

                // Fetch user data
                const userData = await meService();
                if (userData.success === false) throw new Error('Failed to fetch user data');

                setAuthState({
                    isAuthenticated: true,
                    accessToken,
                    user: userData,
                    loading: false,
                });
            } catch (error) {
                localStorage.removeItem('access_token');
                setAuthState({
                    isAuthenticated: false,
                    accessToken: null,
                    user: null,
                    loading: false,
                });
            }
        };

        initAuth();
    }, []);

    useEffect(() => {
        if (!authState.isAuthenticated) return;

        const intervalId = setInterval(() => {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken && isTokenExpired(accessToken)) {
                refreshAuth();
            }
        }, TOKEN_CHECK_INTERVAL);

        return () => clearInterval(intervalId);
    }, [authState.isAuthenticated]);


    const login = async (credentials) => {
        try {
            const response = await loginService(credentials);
            if (!response.accessToken) throw new Error('Login failed');

            updateAxiosAuth(response.accessToken);

            const userData = await meService();
            if (userData.success === false) throw new Error('Failed to fetch user data');

            setAuthState({
                isAuthenticated: true,
                accessToken: response.accessToken,
                user: userData,
                loading: false,
            });

            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };


    const handleLogout = async () => {
        try {
            await logoutService();
            localStorage.removeItem('access_token');
            updateAxiosAuth(null);
            setAuthState({
                isAuthenticated: false,
                accessToken: null,
                user: null,
                loading: false,
            });
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear everything even if the logout request fails
            localStorage.removeItem('access_token');
            updateAxiosAuth(null);
            setAuthState({
                isAuthenticated: false,
                accessToken: null,
                user: null,
                loading: false,
            });
            return { success: false, message: 'Logout failed' };
        }
    };

    const contextValue = {
        ...authState,
        login,
        logout: handleLogout,
        refreshAuth,
    };

    if (authState.loading) {
        return <div>Loading...</div>;
    }



    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};