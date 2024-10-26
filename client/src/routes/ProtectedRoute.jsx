import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinning from '../components/Spinning';

function ProtectedRoute({ children }) {
    const { authState, loading } = useAuth();

    if (loading) {
        return <Spinning spinning={true} />;
    }

    if (!authState.isAuthenticated||!authState.accessToken||authState.isAuthenticated===false) {
        return <Navigate to="/login"  replace />;
    }

    return children;
}

export default ProtectedRoute;
