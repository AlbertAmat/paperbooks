import {ARoute} from "@/router/ARoute";

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