import {PATH_PREFIX} from "@/Constants";
import axiosInstance from "@/plugins/axiosInstance";
import IDashboard from "@/types/dashboard/IDashboard";

/**
 * Thin HTTP client for the `/api/rest/dashboard` endpoint (see server/src/routes/DashboardRoute.ts).
 *
 * @example
 * const stats = await dashboardService.getData();
 */
class DashboardService {

    /** @returns Every KPI/chart series the dashboard view needs, in one call. */
    public async getData(): Promise<IDashboard> {
        const {data} = await axiosInstance.get(`${PATH_PREFIX}/dashboard`)
        return data;
    }
}

/** Singleton instance shared by every part of the app. */
export const dashboardService = new DashboardService();
