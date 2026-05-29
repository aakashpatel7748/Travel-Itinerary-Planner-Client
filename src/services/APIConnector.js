import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const mergedHeaders = { ...headers };
    if (token && !mergedHeaders.Authorization && !mergedHeaders.authorization) {
        mergedHeaders.Authorization = `Bearer ${token}`;
    }

    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: Object.keys(mergedHeaders).length > 0 ? mergedHeaders : null,
        params: params ? params : null,
        withCredentials: true
    });
};
