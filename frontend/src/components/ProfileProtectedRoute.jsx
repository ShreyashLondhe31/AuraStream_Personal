// ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authUser';
import { Outlet, useNavigate } from 'react-router-dom';

function ProfileProtectedRoute({ children }) {
    const { selectProfile, user, needsProfileSelection } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            console.log("Navigating to /login from ProfileProtectedRoute");
            navigate("/login");
            return;
        }

        if (needsProfileSelection || !selectProfile) {
            console.log("Navigating to /profiles from ProfileProtectedRoute");
            navigate("/profiles");
            return;
        }
    }, [user, needsProfileSelection, selectProfile, navigate]);



    return children || <Outlet />;
}

export default ProfileProtectedRoute;