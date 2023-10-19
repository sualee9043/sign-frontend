import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: true
});

axiosInstance.interceptors.response.use(
    function (response) {
        if (response.headers.getAuthorization()) {
            authApiInstance.defaults.headers.common["Authorization"] = response.headers.getAuthorization();
        }
        return response;
    },
    async function (error) {
        return error;
    }
);

export const apiInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true
});

export const authApiInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true
});

authApiInstance.interceptors.response.use(
    function (response) {
        if (response.headers.getAuthorization()) {
            authApiInstance.defaults.headers.common["Authorization"] = response.headers.getAuthorization();
        }
        return response;
    },
    async function (error) {
        return error;
    }
);