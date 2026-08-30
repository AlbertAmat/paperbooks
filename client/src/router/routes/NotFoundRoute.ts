import {ARoute} from "@/router/ARoute";

/** Catch-all route (`/:pathMatch(.*)*`) rendering the 404 view for any unmatched URL. */
export class NotFoundRoute extends ARoute {

    /** Vue Router path pattern for this route (matches any unmatched URL). */
    public static PATH = "/:pathMatch(.*)*";

    /** Route name shown in Vue Router config. */
    private m_name: string = "Not found";

    /** @returns The Vue Router route config for the 404 view. */
    public getRoute() {
        return  {
            name: this.m_name,
            path: NotFoundRoute.PATH,
            component: () => import('@/views/notFound/NotFoundView.vue'),
        }
    }

    /** @returns The catch-all path pattern (not typically navigated to directly). */
    public getPath() {
        return NotFoundRoute.PATH;
    }
}

/** Singleton instance used throughout the app for navigation. */
export const notFoundRoute = new NotFoundRoute();
