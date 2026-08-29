import {ARoute} from "@/router/ARoute";

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

    public getPath(section?: string) {
        return section ? `/docs/${section}` : "/docs";
    }
}

export const docsRoute = new DocsRoute();
