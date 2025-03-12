import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import { JSX } from "react";

/**
 * This checks if the user is logged in, if he/she is not connected
 * allow them to go to the child otherwise it redirects to the login page
 * 
 * @example
 * <Route path="/dashboard" element={<ProtectedRoute defaultRoute="/home" ><Page404 /></ProtectedRoute>} />
 * <Route path="/dashboard" element={<ProtectedRoute ><Teams /></ProtectedRoute>} />
 * <Route path="/Teans" element={<ProtectedRoute defaultRoute="/register"><dahsbour /></ProtectedRoute>} />
 * 
 * @param   {string?}      defaultRoute  which if not given any will redirect to /login
 * @param   {JSX.Element}  children the protected page you want to render 
 * @returns {JSX.Element}  the page you want to protect if the user is logged in 
 */
const ProtectedRoute: React.FC<{ defaultRoute?: string; children: JSX.Element }> = ({
    defaultRoute = "/login",
    children
}) => {
    const { user } = useUser();

    return user.email ? children : <Navigate to={defaultRoute} replace />
}

export default ProtectedRoute;