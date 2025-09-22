import axios from "axios";
import {errorDialogController} from "@/components/errorDialog/ErrorDialogController";

// Create Axios instance
const axiosInstance = axios.create({
    withCredentials: true // always send cookies
});

// Add a response interceptor to catch ALL errors
axiosInstance.interceptors.response.use(
    // If the response is successful, just return it
    response => response,

    // If there's an error, handle it here
    error => {
        // This will catch:
        // - Network errors (no response)
        // - Timeout errors
        // - HTTP errors (status 4xx, 5xx)
        // - Request setup errors
        if (error.response) {
            // Server responded with a status outside 2xx
            console.error("Server Error:", {
                status: error.response.status,
                data: error.response.data,
            });

            errorDialogController.showDialog(error);
        } else if (error.request) {
            // Request was sent but no response received
            console.error("No Response:", error.request);
        } else {
            // Something else happened while setting up the request
            console.error("Request Setup Error:", error.message);
        }

        // You can also add custom logic like:
        // - Show a toast notification
        // - Retry logic
        // TODO: HANDLE CUSTOM ERRORS

        // Always reject so calling code can handle it if needed
        return Promise.reject(error);
    }
);

export default axiosInstance;
