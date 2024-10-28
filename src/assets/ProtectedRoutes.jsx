import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthToken, Base_URL } from './Utilis';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function ProtectedRoutes({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const token = AuthToken();
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true; // This flag ensures the API call is only made if the component is still mounted

        const func = async () => {
            try {
                const res = await axios.get(`${Base_URL}/protected`, { headers: { Authorization: `Bearer ${token}` } });

                if (res.status === 200 && isMounted) {
                    setIsAuthenticated(true);
                }

            } catch (error) {
                if (isMounted) {
                    if (error.response) {
                        toast.error("Please Login");
                    } else {
                        toast.error("Failed");
                    }
                    setIsAuthenticated(false);
                }
            }
        };
        func();

        return () => {
            isMounted = false; // Cleanup function to prevent setting state if the component is unmounted
        };
    }, [token]); // Add 'token' as a dependency to ensure token is always the latest

    if (isAuthenticated === null) {
        return (
            <div className='vh-100 w-100 d-flex justify-content-center align-items-center'>
                <ClipLoader />
            </div>
        );
    }

    return isAuthenticated ? children : navigate("/login");
}

export default ProtectedRoutes;
