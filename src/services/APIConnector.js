import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const mergedHeaders = { ...headers };
    if (token && !mergedHeaders.Authorization && !mergedHeaders.authorization) {
        mergedHeaders.Authorization = `Bearer ${token}`;
    }

    // GET requests should not have a request body (payload)
    const isGet = method.toUpperCase() === 'GET';
    const requestData = isGet ? null : (bodyData ? bodyData : null);

    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: requestData,
        headers: Object.keys(mergedHeaders).length > 0 ? mergedHeaders : null,
        params: params ? params : null,
        withCredentials: true
    });
};
