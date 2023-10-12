import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
});

export const apiInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

export const authApiInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true
});