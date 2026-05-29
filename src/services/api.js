import axios from 'axios';
import { apiConnector } from "./APIConnector";
import { authEndpoints, itineraryEndpoints } from "./apiEndPoints";

const { SIGNUP_ROUTE, GET_LOGIN_ROUTE, LOGOUT_ROUTE, GET_USER_ROUTE } = authEndpoints;

// Create standard axios instance with credentials
const api = axios.create({
    withCredentials: true,
});

// Automatically inject JWT token into requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiry gracefully
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

// Authentication API Adapter (Maintains full backward compatibility)
export const authAPI = Object.assign(
    () => authAPI,
    {
        getUser: async (actionType, val = {}) => {
            const res = await apiConnector("GET", `${GET_USER_ROUTE}?actionType=${actionType}`, { ...val, ActionType: actionType });
            return res.data;
        },
        signup: async (actionType, val = {}) => {
            const res = await apiConnector("POST", `${SIGNUP_ROUTE}?actionType=${actionType}`, { ...val, ActionType: actionType });
            return res.data;
        },
        signin: async (actionType, val = {}) => {
            const res = await apiConnector("POST", `${GET_LOGIN_ROUTE}?actionType=${actionType}`, { ...val, ActionType: actionType });
            return res.data;
        },
        signout: async (actionType, newRecord = {}) => {
            const res = await apiConnector("POST", `${LOGOUT_ROUTE}?actionType=${actionType}`, { ...newRecord, ActionType: actionType });
            return res.data;
        }
    }
);

// AI Itinerary API Layer
export const itinerariesAPI = {
    generate: async (formData) => {
        const token = localStorage.getItem('token');
        const res = await axios.post(itineraryEndpoints.GENERATE_ITINERARY, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        });
        return res.data;
    },
    getAll: async () => {
        const res = await api.get(itineraryEndpoints.GET_ITINERARIES);
        return res.data;
    },
    getDetails: async (id) => {
        const res = await api.get(itineraryEndpoints.GET_ITINERARY_DETAILS(id));
        return res.data;
    },
    toggleShare: async (id) => {
        const res = await api.patch(itineraryEndpoints.TOGGLE_SHARE(id));
        return res.data;
    },
    getShared: async (token) => {
        const res = await axios.get(itineraryEndpoints.GET_SHARED_ITINERARY(token));
        return res.data;
    },
    delete: async (id) => {
        const res = await api.delete(itineraryEndpoints.DELETE_ITINERARY(id));
        return res.data;
    }
};

export default api;
