import {PATH_PREFIX} from "@/Constants";
import axiosInstance from "@/plugins/axiosInstance";
import IDashboard from "@/types/dashboard/IDashboard";

class DashboardService {

    public async getData(): Promise<IDashboard> {
        const {data} = await axiosInstance.get(`${PATH_PREFIX}/dashboard`)
        return data;
    }
}

export const dashboardService = new DashboardService();