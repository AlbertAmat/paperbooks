import {ARoute} from "@/router/ARoute";

export class LegalRoute extends ARoute {

    public static PATH = "/legal/:document?";

    private m_name: string = "Legal";

    public getRoute() {
        return  {
            name: this.m_name,
            path: LegalRoute.PATH,
            component: () => import('@/views/legal/LegalView.vue'),
        }
    }

    public getPath(document?: string) {
        return document ? `/legal/${document}` : "/legal";
    }
}

export const legalRoute = new LegalRoute();
