import {ARoute} from "@/router/ARoute";

/** Route to the in-app documentation view, with an optional section anchor (`/app/docs/:section?`). */
export class DocsRoute extends ARoute {

    public static PATH = "/docs/:section?";

    private m_name: string = "Docs";

    public getRoute() {
        return  {
            name: this.m_name,
            path: DocsRoute.PATH,
            component: () => import('@/views/docs/DocsView.vue'),
        }
    }

    /** @param section Optional doc section id; omit for the docs index. */
    public getPath(section?: string) {
        return section ? `/docs/${section}` : "/docs";
    }
}

export const docsRoute = new DocsRoute();
