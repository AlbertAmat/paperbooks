import {ARoute} from "@/router/ARoute";

/** Catch-all route (`/:pathMatch(.*)*`) rendering the 404 view for any unmatched URL. */
export class NotFoundRoute extends ARoute {

    public static PATH = "/:pathMatch(.*)*";

    private m_name: string = "Not found";

    public getRoute() {
        return  {
            name: this.m_name,
            path: NotFoundRoute.PATH,
            component: () => import('@/views/notFound/NotFoundView.vue'),
        }
    }

    public getPath() {
        return NotFoundRoute.PATH;
    }
}

export const notFoundRoute = new NotFoundRoute();