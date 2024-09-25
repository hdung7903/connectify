import GuestHomePage from '../pages/(guest)/home.jsx';
import AdminHomePage from '../pages/admin/home.jsx';
import UserHomePage from '../pages/user/home.jsx';
import LoginPage from '../pages/auth/login.jsx';
import RegisterPage from '../pages/auth/register.jsx';
import ForgotPasswordPage from '../pages/auth/forgot-password.jsx';
import ResetPasswordPage from '../pages/auth/reset-password.jsx';
import NotFoundPage from '../pages/error/not-found.jsx';
import { Route, Routes } from 'react-router-dom';
import DefaultLayout from '../pages/(guest)/layout.jsx';

function AppRoute() {
    return (
        <Routes>
            {/* Guest routes */}
            <Route path="/" element={<DefaultLayout />}>
                <Route index element={<GuestHomePage />} />
                <Route path="home" element={<UserHomePage />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminHomePage />}>
                <Route index element={<AdminHomePage />} />
                <Route path="*" element={<AdminHomePage />} />
            </Route>

            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:id" element={<ResetPasswordPage />} />

            {/* Not Found route */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default AppRoute;