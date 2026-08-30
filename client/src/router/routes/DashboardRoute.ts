import {ARoute} from "@/router/ARoute";

/** Route to the dashboard/overview view (`/app/dashboard`) - also the app's default landing route. */
export class DashboardRoute extends ARoute {

    /** Vue Router path pattern for this route. */
    public static PATH = "/dashboard";

    /** Route name shown in Vue Router config. */
    private m_name: string = "Dashboard";

    /** @returns The Vue Router route config for the dashboard view. */
    public getRoute() {
        return  {
            name: this.m_name,
            path: DashboardRoute.PATH,
            component: () => import('@/views/dashboard/DashboardView.vue'),
        }
    }

    /** @returns The navigable URL for the dashboard view. */
    public getPath() {
        return DashboardRoute.PATH;
    }
}

/** Singleton instance used throughout the app for navigation. */
export const dashboardRoute = new DashboardRoute();
