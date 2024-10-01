import GuestHomePage from '../pages/(guest)/home.jsx';
import AdminHomePage from '../pages/admin/home.jsx';
import UserHomePage from '../pages/user/home.jsx';
import LoginPage from '../pages/auth/login.jsx';
import RegisterPage from '../pages/auth/register.jsx';
import ForgotPasswordPage from '../pages/auth/forgot-password.jsx';
import ResetPasswordPage from '../pages/auth/reset-password.jsx';
import NotFoundPage from '../pages/error/not-found.jsx';
import AdminLayout from '../pages/admin/layout.jsx';
import GuestLayout from '../pages/(guest)/layout.jsx';
import AuthLayout from '../pages/auth/layout.jsx';
import UserLayout from '../pages/user/layout.jsx';
import ChatPage from '../pages/user/chat.jsx';
import { Route, Routes } from 'react-router-dom';

function AppRoute() {
    return (
        <Routes>
            {/* Guest routes */}
            <Route element={<GuestLayout />}>
                <Route index element={<GuestHomePage />} />
            </Route>

            <Route element={<UserLayout />}>
                <Route index element={<GuestHomePage />} />
                <Route path="/home" element={<UserHomePage />} />
                <Route path="/message" element={<ChatPage />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminHomePage />} />
                {/* Add more admin routes here */}
            </Route>
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:id" element={<ResetPasswordPage />} />
            </Route>
            {/* Not Found route */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default AppRoute;