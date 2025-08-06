import {ARoute} from "@/router/ARoute";

export class DashboardRoute extends ARoute {

    public static PATH = "/dashboard";

    private m_name: string = "Dashboard";

    public getRoute() {
        return  {
            name: this.m_name,
            path: DashboardRoute.PATH,
            component: () => import('@/views/dashboard/DashboardView.vue'),
        }
    }

    public getPath() {
        return DashboardRoute.PATH;
    }
}

export const dashboardRoute = new DashboardRoute();