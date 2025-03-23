import { useNavigate } from "react-router-dom"
import { AuthToken } from "./Utilis";
import { useEffect } from "react";

const PublicRoute = ({ children }) => {
    const navigate = useNavigate();
    const token = AuthToken();
    useEffect(() => {
        if (token) {
            navigate("/dashboard");
        }
    }, [token, navigate])
    return !token && children;
}

export default PublicRoute