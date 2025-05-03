import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import { JSX } from "react";
import RequireAuth from "./auth/requireauth";
import Dashboard from "../pages/DashBoard";

/**
 * This checks if the user is logged in, if he/she is not connected
 * allow them to go to the child otherwise it redirects to the login page or if you
 * specify to another page
 * 
 * @example
 * <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 * <Route path="/Edit-Account" element={<ProtectedRoute><Edit-Account /></ProtectedRoute>} />
 * <Route path="/Teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
 * 
 * @param {JSX.Element} children  
 * @param {string} backup 
 * @returns {JSX.Element} children 
 */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const navigate = useNavigate();
    const { user } = useUser();

    if ((!user) || (!user.email)) {
        navigate("/login");
    }

    return user ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute;