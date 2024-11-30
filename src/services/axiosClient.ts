import axios from "axios";

const axiosClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Add a request interceptor to handle request logic
 */
axiosClient.interceptors.request.use((request) => {
    return request;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;
