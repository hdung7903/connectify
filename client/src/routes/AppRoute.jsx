import GuestHomePage from '../pages/(guest)/home.jsx';
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
import AdminDashboard from '../pages/admin/DashBoard.jsx';
import AddFriend from '../pages/user/friend.jsx';
import OwnerProfile from '../pages/user/OwnerProfile.jsx';
import UserProfile from '../pages/user/UserProfile.jsx';
import { Route, Routes } from 'react-router-dom';
import VerifyAccount from '../pages/auth/verify-account.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
function AppRoute() {
    return (
        <Routes>
            {/* Guest routes */}
            <Route element={<GuestLayout />}>
                <Route index element={<GuestHomePage />} />
            </Route>

            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token/:email" element={<ResetPasswordPage />} />
                <Route path="/verify/:token/:email" element={<VerifyAccount />} />
            </Route>

            <Route element={
                <ProtectedRoute>
                    <UserLayout />
                </ProtectedRoute>
            }>
                <Route index element={<GuestHomePage />} />
                <Route path="/home" element={<UserHomePage />} />
                <Route path="/message" element={<ChatPage />} />
                <Route path="/friends" element={<AddFriend />} />
                <Route path="/profile" element={<OwnerProfile />} />
                <Route path="/profile/:id" element={<UserProfile />} />
                <Route path="/posts/:id" element={<UserHomePage />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={
                <ProtectedRoute>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route index element={<AdminDashboard />} />
            </Route>

            {/* Auth routes */}
           
            {/* Not Found route */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default AppRoute;