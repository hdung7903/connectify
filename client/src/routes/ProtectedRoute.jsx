import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinning from '../components/Spinning';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <Spinning spinning={true} />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login"  replace />;
    }

    return children;
}

export default ProtectedRoute;
