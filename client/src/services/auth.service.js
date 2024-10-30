import api from './axios';

export const loginService = async (values) => {
    try {
        const response = await api.post('/auth/login', values);

        if (response.status === 200) {
            const { accessToken } = response.data;

            localStorage.setItem('access_token', accessToken);

            return { accessToken };
        } else {
            throw new Error(response.data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error.stack);
        const errorMessage = error.response?.data?.message || 'Login failed';
        throw new Error(errorMessage);
    }
};

export const registerService = async (data) => {
    try {
        const response = await api.post('/auth/register', data);

        if (response.status === 201) {
            return { success: true, message: "Registration successful!" };
        } else {
            return { success: false, message: response.data.message || "Registration failed!" };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Registration failed due to a network error",
        };
    }
}

export const verifyAccountService = async (token, email) => {

    try {
        const response = await api.post('/auth/verify-account', { token, email });
        if (response.status === 200) {
            return { success: true, message: "Account verified successfully!" };
        } else {
            return { success: false, message: response.data.message || "Verification failed!" };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Verification failed due to a network error",
        };
    }
}

export const forgotPasswordService = async (data) => {
    try {
        const response = await api.post('/auth/forgot-password', data);
        if (response.status === 200) {
            return { success: true, message: "Password reset link sent to your email!" };
        } else {
            return { success: false, message: response.data.message || "Password reset failed!" };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Password reset failed due to a network error",
        };
    }
}

export const checkResetPasswordTokenService = async (token, email) => {
    try {
        const response = await api.get(`/auth/reset-password/${token}/${email}`, { token, email });
        if (response.status === 200) {
            return { success: true };
        } else {
            return { success: false, message: response.data.message || "Invalid or expired token" };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Invalid or expired token",
        };
    }
}
export const resetPasswordService = async (token, email, password) => {
    try {
        const response = await api.post('/auth/reset-password', { token, email, password });
        if (response.status === 200) {
            return { success: true, message: "Password reset successfully!" };
        } else {
            return { success: false, message: response.data.message || "Password reset failed!" };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Password reset failed due to a network error",
        };
    }
}

export const resendVerificationService = async (data) => {
    try {
        const response = await api.post('/auth/resend-verification', data);
        if (response.status === 200) {
            return { success: true, message: "Verification email sent again!" };
        } else {
            return { success: false, message: response.data.message || "Failed to resend verification" };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Verification reset failed due to a network error",
        };
    }
}

export const resendForgotPasswordService = async (email) => {
    try {
        const response = await api.post('/auth/resend-forgot-password', email);
        if (response.status === 200) {
            return { success: true, message: "Password reset link sent to your email!" };
        } else {
            return { success: false, message: response.data.message || "Failed to resend password reset link" };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Reset password failed due to a network error",
        };
    }
}

export const refreshTokenService = async () => {
    try {
        const response = await api.post('/auth/refresh');
        if (response.status === 200) {
            return response.data;
        }
        throw new Error(response.data.message || "Failed to refresh token");
    } catch (error) {
        throw new Error(error.response?.data?.message || "Refresh token failed");
    }
};

export const meService = async () => {
    try {
        const response = await api.get('/auth/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        if (response.status === 200) {
            return response.data;
        }else{
            await logoutService();
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Get me data failed due to a network error",
        };
    }
}

export const logoutService = async () => {
    try {
        const response = await api.post('/auth/logout', { refreshToken: localStorage.getItem('refresh_token') },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
        if (response.status === 200) {
            localStorage.clear();
            return {success: true, message: "Logged out successfully"};
        } else {
            return { success: false, message: response.data.message || "Failed to logout" };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Logout failed due to a network error",
        };
    }
}
