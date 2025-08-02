import axios from "axios";

// Create Axios instance
const axiosInstance = axios.create({
    withCredentials: true // always send cookies
});

export default axiosInstance;