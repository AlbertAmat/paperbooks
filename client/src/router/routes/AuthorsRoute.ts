import {ARoute} from "@/router/ARoute";

/** Route to the authors management view (`/app/authors`). */
export class AuthorsRoute extends ARoute {

    /** Vue Router path pattern for this route. */
    public static PATH = "/authors";

    /** Route name shown in Vue Router config. */
    private m_name: string = "Authors";

    /** @returns The Vue Router route config for the authors view. */
    public getRoute() {
        return  {
            name: this.m_name,
            path: AuthorsRoute.PATH,
            component: () => import('@/views/authors/AuthorsView.vue'),
        }
    }

    /** @returns The navigable URL for the authors view. */
    public getPath() {
        return AuthorsRoute.PATH;
    }
}

/** Singleton instance used throughout the app for navigation. */
export const authorsRoute = new AuthorsRoute();
