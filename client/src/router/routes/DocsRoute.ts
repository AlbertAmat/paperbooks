import {ARoute} from "@/router/ARoute";

/** Route to the in-app documentation view, with an optional section anchor (`/app/docs/:section?`). */
export class DocsRoute extends ARoute {

    /** Vue Router path pattern for this route. */
    public static PATH = "/docs/:section?";

    /** Route name shown in Vue Router config. */
    private m_name: string = "Docs";

    /** @returns The Vue Router route config for the docs view. */
    public getRoute() {
        return  {
            name: this.m_name,
            path: DocsRoute.PATH,
            component: () => import('@/views/docs/DocsView.vue'),
        }
    }

    /**
     * @param section Optional doc section id; omit for the docs index.
     * @returns The navigable URL for the docs view (optionally scoped to a section).
     */
    public getPath(section?: string) {
        return section ? `/docs/${section}` : "/docs";
    }
}

/** Singleton instance used throughout the app for navigation. */
export const docsRoute = new DocsRoute();
