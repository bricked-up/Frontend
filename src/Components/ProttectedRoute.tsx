import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import { JSX } from "react";

/**
 * 
 * @param param 
 * @returns 
 */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useUser();

    console.log(user.email);

    return user.email ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute;