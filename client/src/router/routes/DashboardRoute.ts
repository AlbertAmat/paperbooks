import {ARoute} from "@/router/ARoute";

/** Route to the dashboard/overview view (`/app/dashboard`) - also the app's default landing route. */
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