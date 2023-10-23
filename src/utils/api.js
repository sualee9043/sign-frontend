import { useContext } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { extractToken } from "./tokenUtils";


export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: true
});

export const apiInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true
});

export const authApiInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true
});

function AuthInterceptor() {
    const { setCurrentUser } = useContext(CurrentUserContext);
    const navigate = useNavigate();

    authApiInstance.interceptors.response.use(
        function (response) {
            return response;
        },
        async function (error) {
            if (error.response.status === 401) {
                try {
                    const tokenResponse = await authApiInstance.post('/refresh/access-token');
                    const newAccessToken = extractToken(tokenResponse.headers["authorization"]);
                    setCurrentUser((currentUser) => ({ 
                        ...currentUser, 
                        accessToken: newAccessToken
                    }));

                    const updatedConfig = { ...error.config };
                    updatedConfig.headers.Authorization = `Bearer ${newAccessToken}`;
                    const secondResponse = await authApiInstance(updatedConfig);
                    return secondResponse;
                } catch (refreshError) {
                    navigate("/login");
                }
            }
            return error;
        }
    );

    return null;
}

export default AuthInterceptor;