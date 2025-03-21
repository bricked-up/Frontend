import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import { JSX } from "react";

/**
 * This checks if the user is logged in, if he/she is not connected
 * allow them to go to the child otherwise it redirects to the login page
 * 
 * @example
 * <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 * <Route path="/Edit-Account" element={<ProtectedRoute><Edit-Account /></ProtectedRoute>} />
 * <Route path="/Teans" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
 * 
 * @param {JSX.Element} children  
 * @returns {JSX.Element} children 
 */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useUser();

    console.log(user.email);

    return user.email ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute;