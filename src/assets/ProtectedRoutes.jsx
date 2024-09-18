import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoutes({ children }) {
    const login = localStorage.getItem("login");
    return login ? children : <Navigate to="/login"/>;
}

export default ProtectedRoutes
