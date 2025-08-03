import {ARoute} from "@/router/ARoute";

export class OverviewRoute extends ARoute {

    public static PATH = "/overview";

    private m_name: string = "Overview";

    public getRoute() {
        return  {
            name: this.m_name,
            path: OverviewRoute.PATH,
            component: () => import('@/views/overview/OverviewView.vue'),
        }
    }

    public getPath() {
        return OverviewRoute.PATH;
    }
}

export const overviewRoute = new OverviewRoute();