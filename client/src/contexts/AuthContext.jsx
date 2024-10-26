import { createContext, useContext, useEffect, useState } from 'react';
import { loginService, logoutService } from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        accessToken: null,
    });

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const storedAccessToken = localStorage.getItem('access_token');
        
        if (storedAccessToken) {
            setAuthState({
                isAuthenticated: true,
                accessToken: storedAccessToken,
            });
        }
    };

    const loginContext = async (values) => {
        try {
            const { accessToken } = await loginService(values); 
            localStorage.setItem('access_token', accessToken); 

            setAuthState({
                isAuthenticated: true,
                accessToken: accessToken,
            });
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: error.message };
        }
    };


    const logoutContext = async () => {
        setAuthState({
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null
        });
    }

    const handleLogout = async () => {
        try {
            const response = await logoutService();
            if (response.success) {
                await logoutContext();
                localStorage.clear();
                return { success: true };
            }
            return { success: false, message: response.message };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, message: 'Logout failed' };
        }
    };


    return (
        <AuthContext.Provider value={{ authState, loginContext, logoutContext, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};